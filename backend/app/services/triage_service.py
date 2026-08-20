# backend/app/services/triage_service.py
# Core business logic service for emergency triage evaluation and session persistence.

import time
import uuid
import logging
from datetime import datetime, timezone
from typing import List, Optional, Any
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.prolog.engine import prolog_bridge
from app.db.models.session import EmergencySession
from app.db.models.fact import SessionFact
from app.db.models.audit import TriageAuditTrail
from app.domain.schemas.triage import EvaluateCrisisResponse, FactItem
from app.domain.schemas.session import SessionResponse, SessionDetailResponse, SessionFactResponse, AuditTrailResponse

logger = logging.getLogger("crisisguard.services.triage")

class TriageService:
    """
    Orchestrates emergency triage logic, cumulative fact aggregation,
    Prolog symbolic reasoning inference, and immutable audit persistence.
    """

    async def get_or_create_session(
        self,
        session_token: str,
        domain: str,
        db: AsyncSession
    ) -> Optional[EmergencySession]:
        """
        Retrieves an active session by token or creates a new one.
        """
        try:
            stmt = select(EmergencySession).where(EmergencySession.session_token == session_token)
            result = await db.execute(stmt)
            session = result.scalar_one_or_none()

            if session is None:
                session = EmergencySession(
                    id=uuid.uuid4(),
                    session_token=session_token,
                    domain=domain,
                    current_severity="moderate",
                    is_active=True
                )
                db.add(session)
                await db.flush()

            return session
        except Exception as e:
            logger.warning(f"Database session query failed: {e}")
            return None

    async def evaluate_and_persist(
        self,
        session_token: str,
        domain: str,
        new_facts: List[Any],
        db: Optional[AsyncSession] = None
    ) -> EvaluateCrisisResponse:
        """
        Executes cumulative first-order logic reasoning and logs immutable audit trail.
        Features graceful degradation if database is unreachable.
        """
        start_time = time.time()
        combined_facts: List[dict] = []

        # Convert input new_facts to standard dicts
        for f in new_facts:
            if isinstance(f, dict):
                k = f.get("key") or f.get("fact_key")
                v = f.get("value") or f.get("fact_value")
                if k is not None:
                    combined_facts.append({"key": str(k), "value": str(v)})
            elif hasattr(f, "key") and hasattr(f, "value"):
                combined_facts.append({"key": str(f.key), "value": str(f.value)})
            elif hasattr(f, "fact_key") and hasattr(f, "fact_value"):
                combined_facts.append({"key": str(f.fact_key), "value": str(f.fact_value)})

        session_id = None
        if db is not None:
            try:
                # 1. Fetch or create emergency session
                session = await self.get_or_create_session(session_token, domain, db)
                if session is not None:
                    session_id = session.id

                    # 2. Persist newly submitted facts
                    for fact in combined_facts:
                        session_fact = SessionFact(
                            session_id=session.id,
                            fact_key=fact["key"],
                            fact_value=fact["value"]
                        )
                        db.add(session_fact)
                    await db.flush()

                    # 3. Load all cumulative facts for this session
                    facts_stmt = select(SessionFact).where(SessionFact.session_id == session.id)
                    facts_result = await db.execute(facts_stmt)
                    all_db_facts = facts_result.scalars().all()

                    # Deduplicate by latest fact key
                    fact_map = {}
                    for db_fact in all_db_facts:
                        fact_map[db_fact.fact_key] = db_fact.fact_value
                    combined_facts = [{"key": k, "value": v} for k, v in fact_map.items()]
            except Exception as db_err:
                logger.warning(f"Database persistence skipped during triage: {db_err}")

        # 4. Evaluate using embedded Prolog & symbolic inference engine
        evaluation = prolog_bridge.evaluate_crisis(domain, combined_facts)
        latency_ms = max(1, int((time.time() - start_time) * 1000))

        action_headline = evaluation.get("action", "call_emergency_services_immediately")
        severity = evaluation.get("severity", "critical")
        reasons = evaluation.get("reasons", [])
        prohibitions = evaluation.get("prohibited_actions", [])
        step_by_step = evaluation.get("step_by_step_instructions", [])
        proof_tree = evaluation.get("proof_tree", {})
        timestamp_str = datetime.now(timezone.utc).isoformat()

        # 5. Persist audit trail and update session severity
        if db is not None and session_id is not None:
            try:
                session.current_severity = severity
                audit = TriageAuditTrail(
                    session_id=session_id,
                    recommended_action=action_headline,
                    severity=severity,
                    reasons=reasons,
                    prohibited_actions=prohibitions,
                    evaluation_latency_ms=latency_ms
                )
                db.add(audit)
                await db.commit()
            except Exception as audit_err:
                logger.warning(f"Audit log persistence skipped: {audit_err}")

        return EvaluateCrisisResponse(
            session_token=session_token,
            domain=domain,
            severity=severity,
            action_headline=action_headline,
            step_by_step_instructions=step_by_step,
            reasons=reasons,
            prohibited_actions=prohibitions,
            proof_tree=proof_tree,
            evaluation_latency_ms=latency_ms,
            timestamp=timestamp_str
        )

    async def create_session(self, domain: str, db: AsyncSession) -> SessionResponse:
        """
        Creates a new unique emergency session.
        """
        token = str(uuid.uuid4())
        session = EmergencySession(
            id=uuid.uuid4(),
            session_token=token,
            domain=domain,
            current_severity="moderate",
            is_active=True
        )
        try:
            db.add(session)
            await db.commit()
            await db.refresh(session)
            return SessionResponse(
                session_token=session.session_token,
                domain=session.domain,
                current_severity=session.current_severity,
                is_active=session.is_active,
                created_at=session.created_at
            )
        except Exception:
            # Fallback memory session if DB offline
            from datetime import datetime, timezone
            return SessionResponse(
                session_token=token,
                domain=domain,
                current_severity="moderate",
                is_active=True,
                created_at=datetime.now(timezone.utc)
            )

    async def get_session_detail(self, token: str, db: AsyncSession) -> Optional[SessionDetailResponse]:
        """
        Retrieves full session info, accumulated facts, and audit trail records.
        """
        try:
            stmt = (
                select(EmergencySession)
                .where(EmergencySession.session_token == token)
                .options(selectinload(EmergencySession.facts), selectinload(EmergencySession.audits))
            )
            result = await db.execute(stmt)
            session = result.scalar_one_or_none()
            if session is None:
                return None

            fact_items = [
                SessionFactResponse(key=f.fact_key, value=f.fact_value, created_at=f.created_at)
                for f in session.facts
            ]
            audit_items = [
                AuditTrailResponse(
                    recommended_action=a.recommended_action,
                    severity=a.severity,
                    reasons=a.reasons if isinstance(a.reasons, list) else [],
                    prohibited_actions=a.prohibited_actions if isinstance(a.prohibited_actions, list) else [],
                    evaluation_latency_ms=a.evaluation_latency_ms,
                    created_at=a.created_at
                )
                for a in session.audits
            ]

            return SessionDetailResponse(
                session_token=session.session_token,
                domain=session.domain,
                current_severity=session.current_severity,
                is_active=session.is_active,
                created_at=session.created_at,
                facts=fact_items,
                audit_trail=audit_items
            )
        except Exception as e:
            logger.warning(f"Error fetching session {token}: {e}")
            return None

    async def add_session_facts(
        self,
        token: str,
        facts: List[FactItem],
        db: AsyncSession
    ) -> Optional[List[SessionFactResponse]]:
        """
        Appends facts to a session without triggering evaluation.
        """
        try:
            stmt = select(EmergencySession).where(EmergencySession.session_token == token)
            result = await db.execute(stmt)
            session = result.scalar_one_or_none()
            if session is None:
                return None

            for f in facts:
                fact_row = SessionFact(
                    session_id=session.id,
                    fact_key=str(f.key),
                    fact_value=str(f.value)
                )
                db.add(fact_row)
            await db.commit()

            facts_stmt = select(SessionFact).where(SessionFact.session_id == session.id)
            all_facts = (await db.execute(facts_stmt)).scalars().all()

            return [
                SessionFactResponse(key=f.fact_key, value=f.fact_value, created_at=f.created_at)
                for f in all_facts
            ]
        except Exception as e:
            logger.warning(f"Error adding facts to session {token}: {e}")
            return []

    async def get_session_audit(self, token: str, db: AsyncSession) -> List[AuditTrailResponse]:
        """
        Retrieves all audit trail records for a given session token.
        """
        try:
            stmt = (
                select(TriageAuditTrail)
                .join(EmergencySession, EmergencySession.id == TriageAuditTrail.session_id)
                .where(EmergencySession.session_token == token)
                .order_by(TriageAuditTrail.created_at.desc())
            )
            result = await db.execute(stmt)
            audits = result.scalars().all()
            return [
                AuditTrailResponse(
                    id=a.id,
                    session_token=token,
                    recommended_action=a.recommended_action,
                    severity=a.severity,
                    reasons=a.reasons if isinstance(a.reasons, list) else [],
                    prohibited_actions=a.prohibited_actions if isinstance(a.prohibited_actions, list) else [],
                    evaluation_latency_ms=a.evaluation_latency_ms,
                    created_at=a.created_at
                )
                for a in audits
            ]
        except Exception as e:
            logger.warning(f"Error fetching session audits for {token}: {e}")
            return []

    async def get_all_audits(self, db: AsyncSession) -> List[AuditTrailResponse]:
        """
        Retrieves all immutable audit trail logs across all emergency sessions.
        """
        try:
            stmt = (
                select(TriageAuditTrail, EmergencySession.session_token, EmergencySession.domain)
                .join(EmergencySession, EmergencySession.id == TriageAuditTrail.session_id)
                .order_by(TriageAuditTrail.created_at.desc())
            )
            result = await db.execute(stmt)
            rows = result.all()
            audits = []
            for audit, session_token, domain in rows:
                audits.append(
                    AuditTrailResponse(
                        id=audit.id,
                        session_token=session_token,
                        domain=domain,
                        recommended_action=audit.recommended_action,
                        severity=audit.severity,
                        reasons=audit.reasons if isinstance(audit.reasons, list) else [],
                        prohibited_actions=audit.prohibited_actions if isinstance(audit.prohibited_actions, list) else [],
                        evaluation_latency_ms=audit.evaluation_latency_ms,
                        created_at=audit.created_at
                    )
                )
            return audits
        except Exception as e:
            logger.warning(f"Error fetching all audits: {e}")
            return []

triage_service = TriageService()

