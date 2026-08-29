# backend/app/domain/schemas/__init__.py
# Export all domain schemas

from app.domain.schemas.triage import (
    TriageSeverity,
    CrisisDomain,
    FactItem,
    EvaluateCrisisRequest,
    EvaluateCrisisResponse,
    BatchEvaluateCrisisRequest,
)
from app.domain.schemas.session import (
    CreateSessionRequest,
    SessionFactResponse,
    AuditTrailResponse,
    SessionResponse,
    SessionDetailResponse,
    AddSessionFactsRequest,
    AddSessionFactsResponse,
)
from app.domain.schemas.shelter import (
    ShelterQuery,
    ShelterResponse,
    ShelterListResponse,
)
from app.domain.schemas.scheduler import (
    OptimizeScheduleRequest,
    OptimizeScheduleResponse,
)
from app.domain.schemas.health import (
    HealthResponse,
    PrologHealthResponse,
)

__all__ = [
    "TriageSeverity",
    "CrisisDomain",
    "FactItem",
    "EvaluateCrisisRequest",
    "EvaluateCrisisResponse",
    "BatchEvaluateCrisisRequest",
    "CreateSessionRequest",
    "SessionFactResponse",
    "AuditTrailResponse",
    "SessionResponse",
    "SessionDetailResponse",
    "AddSessionFactsRequest",
    "AddSessionFactsResponse",
    "ShelterQuery",
    "ShelterResponse",
    "ShelterListResponse",
    "OptimizeScheduleRequest",
    "OptimizeScheduleResponse",
    "HealthResponse",
    "PrologHealthResponse",
]
