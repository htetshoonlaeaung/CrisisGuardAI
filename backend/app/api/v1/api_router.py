# backend/app/api/v1/api_router.py
# Aggregates all v1 endpoint routers into a single router mounted at /api/v1

from fastapi import APIRouter

from app.api.v1.endpoints.crisis import router as crisis_router
from app.api.v1.endpoints.sessions import router as sessions_router
from app.api.v1.endpoints.shelters import router as shelters_router
from app.api.v1.endpoints.scheduler import router as scheduler_router
from app.api.v1.endpoints.health import router as health_router
from app.api.v1.endpoints.audit import router as audit_router

api_router = APIRouter(prefix="/api/v1")

api_router.include_router(crisis_router)
api_router.include_router(sessions_router)
api_router.include_router(shelters_router)
api_router.include_router(scheduler_router)
api_router.include_router(health_router)
api_router.include_router(audit_router)

__all__ = ["api_router"]
