# backend/app/services/triage_service.py
# Core business logic service for emergency triage evaluation.
# Orchestrates:
#   1. Persisting submitted facts to Neon PostgreSQL (via Async SQLAlchemy)
#   2. Querying the PrologEngineBridge with all cumulative session facts
#   3. Writing the triage audit trail back to Neon PostgreSQL
#   4. Returning a structured EvaluateCrisisResponse to the API endpoint

from typing import List
from sqlalchemy.ext.asyncio import AsyncSession

class TriageService:
    async def evaluate_and_persist(
        self,
        session_token: str,
        domain: str,
        new_facts: List[dict],
        db: AsyncSession
    ):
        # TODO: Fetch or create EmergencySession from Neon DB
        # TODO: Insert new SessionFact rows into Neon DB
        # TODO: Retrieve all cumulative facts for session
        # TODO: Call prolog_bridge.evaluate_crisis(domain, prolog_facts)
        # TODO: Update session severity + insert TriageAuditTrail in Neon DB
        # TODO: Return EvaluateCrisisResponse
        pass

triage_service = TriageService()
