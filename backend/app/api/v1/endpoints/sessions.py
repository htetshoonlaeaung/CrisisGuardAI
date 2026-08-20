# backend/app/api/v1/endpoints/sessions.py
# Active emergency session lifecycle endpoint

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.api.deps import get_triage_service_dep
from app.services.triage_service import TriageService
from app.domain.schemas.session import (
    CreateSessionRequest,
    SessionResponse,
    SessionDetailResponse,
    AddSessionFactsRequest,
    SessionFactResponse,
    AuditTrailResponse,
)

router = APIRouter(prefix="/sessions", tags=["Emergency Sessions"])

@router.post(
    "/create",
    response_model=SessionResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new emergency session"
)
async def create_session(
    request: CreateSessionRequest,
    db: AsyncSession = Depends(get_db),
    triage_service: TriageService = Depends(get_triage_service_dep)
):
    """
    Initializes a new emergency session context with unique UUID token.
    """
    return await triage_service.create_session(domain=request.domain, db=db)

@router.get(
    "/{token}",
    response_model=SessionDetailResponse,
    status_code=status.HTTP_200_OK,
    summary="Get full session details with facts and audit trail"
)
async def get_session(
    token: str,
    db: AsyncSession = Depends(get_db),
    triage_service: TriageService = Depends(get_triage_service_dep)
):
    """
    Retrieves full session state including all cumulative facts and immutable audit logs.
    """
    detail = await triage_service.get_session_detail(token=token, db=db)
    if detail is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found"
        )
    return detail

@router.post(
    "/{token}/facts",
    response_model=List[SessionFactResponse],
    status_code=status.HTTP_200_OK,
    summary="Add facts to an existing session"
)
async def add_session_facts(
    token: str,
    request: AddSessionFactsRequest,
    db: AsyncSession = Depends(get_db),
    triage_service: TriageService = Depends(get_triage_service_dep)
):
    """
    Appends facts to a session without immediately triggering evaluation.
    """
    facts = await triage_service.add_session_facts(token=token, facts=request.facts, db=db)
    if facts is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found"
        )
    return facts

@router.get(
    "/{token}/audit",
    response_model=List[AuditTrailResponse],
    status_code=status.HTTP_200_OK,
    summary="Get full audit trail records for a specific session"
)
async def get_session_audit(
    token: str,
    db: AsyncSession = Depends(get_db),
    triage_service: TriageService = Depends(get_triage_service_dep)
):
    """
    Retrieves chronological reasoning audit trail logs for an emergency session.
    """
    return await triage_service.get_session_audit(token=token, db=db)
