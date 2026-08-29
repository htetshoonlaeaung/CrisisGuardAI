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

class DispatchIncidentItem(BaseModel):
    id: str = Field(..., description="Unique incident ID")
    name: str = Field(..., description="Incident name or description")
    severity: str = Field(..., description="Incident severity level (critical, high, moderate, low)")
    victims_count: int = Field(1, ge=1, description="Number of casualties requiring rescue")
    hazard_type: str = Field("general", description="Hazard type (e.g. fire, medical, flood, trauma)")
    location: str = Field("Unknown", description="Incident location description")

class DispatchRescueTeam(BaseModel):
    id: int = Field(..., description="Unique rescue team ID")
    name: str = Field(..., description="Team name")
    type: str = Field("paramedic", description="Team specialty (paramedic, fire_rescue, heavy_extrication, flood_boat)")
    vehicle_capacity: int = Field(..., ge=1, description="Vehicle transport capacity")
    is_available: bool = Field(True, description="Availability status")
    base_location: str = Field("HQ", description="Team station/base location")

class DispatchPlan(BaseModel):
    incident_id: str = Field(..., description="Assigned incident ID")
    incident_name: str = Field(..., description="Assigned incident name")
    severity: str = Field(..., description="Incident severity")
    assigned_team_id: int = Field(..., description="Assigned rescue team ID")
    team_name: str = Field(..., description="Assigned rescue team name")
    estimated_arrival_minutes: int = Field(..., description="Estimated travel time in minutes")
    constraints_satisfied: List[str] = Field(default_factory=list, description="List of verified constraints")

class DispatchSchedulerRequest(BaseModel):
    incidents: List[DispatchIncidentItem] = Field(..., min_length=1, description="Active incidents awaiting response")
    teams: List[DispatchRescueTeam] = Field(..., min_length=1, description="Available rescue fleet teams")

class DispatchResponse(BaseModel):
    success: bool = Field(True, description="Dispatch solver status")
    solver: str = Field("CLP(FD) Symbolic Constraint Solver", description="Constraint engine identifier")
    plans: List[DispatchPlan] = Field(default_factory=list, description="Optimized incident-to-team assignments")
    unassigned_incidents: List[str] = Field(default_factory=list, description="Incident IDs unable to be served")
    total_latency_ms: int = Field(0, description="Solver execution time in milliseconds")
