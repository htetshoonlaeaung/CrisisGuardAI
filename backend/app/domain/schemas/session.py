# backend/app/domain/schemas/session.py
# Pydantic v2 schemas for emergency session create and retrieve responses.

from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field
from app.domain.schemas.triage import FactItem

class CreateSessionRequest(BaseModel):
    domain: str = Field(..., description="Initial crisis domain (medical, natural_disaster, fire_hazard, road_accident)")

    model_config = {
        "json_schema_extra": {
            "example": {
                "domain": "medical"
            }
        }
    }

class SessionFactResponse(BaseModel):
    key: str = Field(..., description="Fact key name")
    value: str = Field(..., description="Fact value")
    created_at: Optional[datetime] = Field(None, description="Timestamp fact was recorded")

class AuditTrailResponse(BaseModel):
    id: Optional[int] = Field(None, description="Audit record ID")
    session_token: Optional[str] = Field(None, description="Associated session token")
    domain: Optional[str] = Field(None, description="Crisis domain")
    recommended_action: str = Field(..., description="Action recommendation derived at this step")
    severity: str = Field(..., description="Assessed severity level")
    reasons: List[str] = Field(default_factory=list, description="Reasoning proof steps")
    prohibited_actions: List[str] = Field(default_factory=list, description="Prohibitions at this step")
    facts_snapshot: List[FactItem] = Field(default_factory=list, description="Snapshot of active facts during evaluation")
    evaluation_latency_ms: int = Field(0, description="Evaluation duration in milliseconds")
    created_at: Optional[datetime] = Field(None, description="Audit log entry timestamp")

class SessionResponse(BaseModel):
    session_token: str = Field(..., description="Unique UUID token for session")
    domain: str = Field(..., description="Active crisis domain")
    current_severity: str = Field("moderate", description="Current highest severity level")
    is_active: bool = Field(True, description="Session status")
    created_at: datetime = Field(..., description="Session start timestamp")

    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "session_token": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
                "domain": "medical",
                "current_severity": "critical",
                "is_active": True,
                "created_at": "2026-08-19T14:00:00Z"
            }
        }
    )

class SessionDetailResponse(SessionResponse):
    facts: List[SessionFactResponse] = Field(default_factory=list, description="All cumulative facts in session")
    audit_trail: List[AuditTrailResponse] = Field(default_factory=list, description="Full immutable triage history")

class AddSessionFactsRequest(BaseModel):
    facts: List[FactItem] = Field(default_factory=list, description="List of new facts to append")

class AddSessionFactsResponse(BaseModel):
    session_token: str = Field(..., description="Session token")
    facts: List[SessionFactResponse] = Field(default_factory=list, description="Updated full fact list")
