# backend/app/domain/schemas/scheduler.py
# Pydantic v2 schemas for CLP(FD) rescue team scheduling optimization.

from typing import List, Optional
from pydantic import BaseModel, Field

class OptimizeScheduleRequest(BaseModel):
    incident_severities: List[str] = Field(
        ...,
        min_length=1,
        description="List of incident severity ratings (e.g. ['critical', 'high', 'moderate'])"
    )
    team_capacities: List[int] = Field(
        ...,
        min_length=1,
        description="Available capacities for rescue teams (e.g. [10, 8, 6, 12])"
    )
    max_time: Optional[int] = Field(60, gt=0, description="Maximum allowable response window in minutes")

    model_config = {
        "json_schema_extra": {
            "example": {
                "incident_severities": ["critical", "high", "moderate", "critical"],
                "team_capacities": [10, 8, 6, 12],
                "max_time": 60
            }
        }
    }

class OptimizeScheduleResponse(BaseModel):
    assignments: List[int] = Field(default_factory=list, description="Assigned team index for each incident (1-indexed)")
    optimization_status: str = Field("optimal", description="Optimization result status")
    solving_time_ms: int = Field(0, description="Constraint resolution latency in milliseconds")

    model_config = {
        "json_schema_extra": {
            "example": {
                "assignments": [1, 3, 4, 2],
                "optimization_status": "optimal",
                "solving_time_ms": 4
            }
        }
    }
