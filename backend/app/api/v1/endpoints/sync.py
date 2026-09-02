# backend/app/api/v1/endpoints/sync.py
# Sync endpoint - handles offline data sync from clients

from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel

from app.core.database import get_db
from app.models.session import TriageSession
from app.models.audit import TriageAuditTrail

router = APIRouter(prefix="/sync", tags=["sync"])

# Request/Response Models
class SyncSessionData(BaseModel):
    session_token: str
    domain: str
    facts: list
    current_severity: str
    is_active: bool
    created_at: str
    updated_at: str
    is_offline_created: bool

class SyncAuditData(BaseModel):
    session_token: str
    domain: str
    recommended_action: str
    severity: str
    reasons: List[str]
    prohibited_actions: List[str]
    facts_snapshot: list
    evaluation_latency_ms: int
    created_at: str
    is_offline_created: bool

class SyncItemRequest(BaseModel):
    client_id: str
    type: str  # 'session' or 'audit'
    data: dict

class SyncBatchRequest(BaseModel):
    items: List[SyncItemRequest]
    client_version: Optional[str] = None

class SyncItemResponse(BaseModel):
    client_id: str
    success: bool
    error: Optional[str] = None
    server_id: Optional[int] = None

class SyncBatchResponse(BaseModel):
    results: List[SyncItemResponse]
    server_timestamp: str
    items_synced: int

@router.post("/batch", response_model=SyncBatchResponse)
async def sync_batch(request: SyncBatchRequest, db: Session = Depends(get_db)):
    """Batch sync endpoint for offline clients"""
    results = []
    items_synced = 0

    try:
        for item in request.items:
            result = await sync_single_item(item, db)
            results.append(result)
            if result.success:
                items_synced += 1

        return SyncBatchResponse(
            results=results,
            server_timestamp=datetime.utcnow().isoformat(),
            items_synced=items_synced
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Sync failed: {str(e)}")

async def sync_single_item(item: SyncItemRequest, db: Session) -> SyncItemResponse:
    """Process single sync item"""
    try:
        if item.type == "session":
            return await sync_session(item, db)
        elif item.type == "audit":
            return await sync_audit(item, db)
        else:
            return SyncItemResponse(
                client_id=item.client_id,
                success=False,
                error=f"Unknown type: {item.type}"
            )
    except Exception as e:
        return SyncItemResponse(
            client_id=item.client_id,
            success=False,
            error=str(e)
        )


async def sync_session(item: SyncItemRequest, db: Session) -> SyncItemResponse:
    """Sync session record - server version wins on conflict"""
    data = item.data
    
    try:
        existing = db.query(TriageSession).filter(
            TriageSession.session_token == data.get('session_token')
        ).first()

        if existing:
            # UPDATE: Server version wins - only update if offline newer
            offline_updated = datetime.fromisoformat(data.get('updated_at', ''))
            server_updated = existing.updated_at

            if offline_updated > server_updated:
                existing.facts = data.get('facts', [])
                existing.current_severity = data.get('current_severity')
                existing.updated_at = datetime.utcnow()
                db.commit()

            return SyncItemResponse(
                client_id=item.client_id,
                success=True,
                server_id=existing.id
            )
        else:
            # CREATE: New session from offline
            new_session = TriageSession(
                session_token=data.get('session_token'),
                domain=data.get('domain'),
                facts=data.get('facts', []),
                current_severity=data.get('current_severity'),
                is_active=data.get('is_active', True),
                created_at=datetime.fromisoformat(data.get('created_at', '')),
                updated_at=datetime.utcnow()
            )
            db.add(new_session)
            db.commit()
            db.refresh(new_session)

            return SyncItemResponse(
                client_id=item.client_id,
                success=True,
                server_id=new_session.id
            )
    except Exception as e:
        db.rollback()
        return SyncItemResponse(
            client_id=item.client_id,
            success=False,
            error=str(e)
        )

async def sync_audit(item: SyncItemRequest, db: Session) -> SyncItemResponse:
    """Sync audit trail record"""
    data = item.data

    try:
        new_audit = TriageAuditTrail(
            session_token=data.get('session_token'),
            domain=data.get('domain'),
            recommended_action=data.get('recommended_action'),
            severity=data.get('severity'),
            reasons=data.get('reasons', []),
            prohibited_actions=data.get('prohibited_actions', []),
            facts_snapshot=data.get('facts_snapshot', []),
            evaluation_latency_ms=data.get('evaluation_latency_ms'),
            created_at=datetime.fromisoformat(data.get('created_at', ''))
        )
        db.add(new_audit)
        db.commit()
        db.refresh(new_audit)

        return SyncItemResponse(
            client_id=item.client_id,
            success=True,
            server_id=new_audit.id
        )
    except Exception as e:
        db.rollback()
        return SyncItemResponse(
            client_id=item.client_id,
            success=False,
            error=str(e)
        )

