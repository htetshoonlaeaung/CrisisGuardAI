# backend/app/api/v1/endpoints/audit.py
# System-wide emergency audit log queries

from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.api.deps import get_triage_service_dep
from app.services.triage_service import TriageService
from app.domain.schemas.session import AuditTrailResponse

router = APIRouter(prefix="/audit", tags=["Audit Trail"])

@router.get(
    "/all",
    response_model=List[AuditTrailResponse],
    status_code=status.HTTP_200_OK,
    summary="Get all immutable triage audit trails"
)
async def get_all_audits(
    db: AsyncSession = Depends(get_db),
    triage_service: TriageService = Depends(get_triage_service_dep)
):
    """
    Retrieves all immutable reasoning audit trail logs across all emergency sessions.
    """
    return await triage_service.get_all_audits(db=db)
