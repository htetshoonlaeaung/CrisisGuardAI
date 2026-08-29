# backend/app/api/v1/endpoints/crisis.py
# Emergency triage & evaluation endpoint

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.api.deps import get_triage_service_dep
from app.services.triage_service import TriageService
from app.domain.schemas.triage import (
    EvaluateCrisisRequest,
    EvaluateCrisisResponse,
    BatchEvaluateCrisisRequest,
)

router = APIRouter(prefix="/crisis", tags=["Crisis Triage"])

@router.post(
    "/evaluate",
    response_model=EvaluateCrisisResponse,
    status_code=status.HTTP_200_OK,
    summary="Evaluate single crisis scenario"
)
async def evaluate_crisis(
    request: EvaluateCrisisRequest,
    db: AsyncSession = Depends(get_db),
    triage_service: TriageService = Depends(get_triage_service_dep)
):
    """
    Submits emergency facts, executes deterministic first-order logic reasoning,
    logs the evaluation into the audit trail, and returns triage actions.
    """
    try:
        response = await triage_service.evaluate_and_persist(
            session_token=request.session_token,
            domain=request.domain,
            new_facts=request.submitted_facts,
            db=db
        )
        return response
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Prolog engine evaluation failed: {str(exc)}"
        )

@router.post(
    "/evaluate/batch",
    response_model=List[EvaluateCrisisResponse],
    status_code=status.HTTP_200_OK,
    summary="Batch evaluate multiple crisis scenarios"
)
async def evaluate_crisis_batch(
    request: BatchEvaluateCrisisRequest,
    db: AsyncSession = Depends(get_db),
    triage_service: TriageService = Depends(get_triage_service_dep)
):
    """
    Evaluates multiple crisis scenarios concurrently or sequentially.
    """
    responses = []
    for item in request.evaluations:
        res = await triage_service.evaluate_and_persist(
            session_token=item.session_token,
            domain=item.domain,
            new_facts=item.submitted_facts,
            db=db
        )
        responses.append(res)
    return responses
