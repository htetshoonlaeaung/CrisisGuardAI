# backend/app/api/v1/endpoints/health.py
# System and Prolog engine health check endpoint

import time
from fastapi import APIRouter, Depends, status
from app.core.config import settings
from app.api.deps import get_prolog_engine, PrologEngineBridge
from app.domain.schemas.health import (
    HealthResponse,
    PrologHealthResponse,
)

router = APIRouter(prefix="/health", tags=["Health"])

START_TIME = time.time()

@router.get(
    "",
    response_model=HealthResponse,
    status_code=status.HTTP_200_OK,
    summary="Application health check"
)
@router.get(
    "/",
    response_model=HealthResponse,
    status_code=status.HTTP_200_OK,
    include_in_schema=False
)
async def health_check():
    """
    Returns application status, version, and server uptime in seconds.
    """
    uptime = int(time.time() - START_TIME)
    return HealthResponse(
        status="healthy",
        version=settings.VERSION,
        uptime_seconds=uptime
    )

@router.get(
    "/prolog",
    response_model=PrologHealthResponse,
    status_code=status.HTTP_200_OK,
    summary="Prolog reasoning engine status"
)
async def prolog_health_check(
    engine: PrologEngineBridge = Depends(get_prolog_engine)
):
    """
    Returns Prolog engine readiness status and count of loaded knowledge base files.
    """
    return PrologHealthResponse(
        prolog_status="ready",
        knowledge_bases_loaded=engine.kb_count,
        engine_ready=engine.is_ready
    )
