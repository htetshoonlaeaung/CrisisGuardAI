# backend/app/domain/schemas/triage.py
# Pydantic v2 schemas for the crisis triage request and response data contracts.
# These models validate all data entering and leaving the /crisis/evaluate endpoint.

from enum import Enum
from typing import Any, List, Union
from pydantic import BaseModel, Field, field_validator

class TriageSeverity(str, Enum):
    CRITICAL = "critical"
    HIGH = "high"
    MODERATE = "moderate"
    LOW = "low"
    INFORMATIONAL = "informational"

class CrisisDomain(str, Enum):
    MEDICAL = "medical"
    NATURAL_DISASTER = "natural_disaster"
    FIRE_HAZARD = "fire_hazard"
    ROAD_ACCIDENT = "road_accident"

class FactItem(BaseModel):
    key: str = Field(..., description="Fact identifier (e.g. 'unconscious', 'breathing')", min_length=1)
    value: Union[str, int, float, bool] = Field(..., description="Fact value (e.g. 'true', 'none', 100)")

    @field_validator("key", mode="before")
    @classmethod
    def clean_key(cls, v: Any) -> str:
        return str(v).strip().lower().replace("-", "_").replace(" ", "_")

    @field_validator("value", mode="before")
    @classmethod
    def clean_value(cls, v: Any) -> Union[str, int, float, bool]:
        if isinstance(v, (int, float, bool)):
            return v
        return str(v).strip()

    def to_str_dict(self) -> dict:
        return {"key": str(self.key), "value": str(self.value)}

class EvaluateCrisisRequest(BaseModel):
    session_token: str = Field(..., description="Unique emergency session token", min_length=1)
    domain: str = Field(..., description="Crisis domain: medical, natural_disaster, fire_hazard, road_accident")
    submitted_facts: List[FactItem] = Field(default_factory=list, description="List of patient/scene facts")

    @field_validator("domain", mode="before")
    @classmethod
    def clean_domain(cls, v: Any) -> str:
        clean = str(v).strip().lower().replace("-", "_").replace(" ", "_")
        if clean in ("natural_disasters", "disaster", "disasters"):
            return "natural_disaster"
        if clean in ("fire_hazards", "fire", "hazard", "hazards"):
            return "fire_hazard"
        if clean in ("road_accidents", "accident", "traffic"):
            return "road_accident"
        return clean

    model_config = {
        "json_schema_extra": {
            "example": {
                "session_token": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
                "domain": "medical",
                "submitted_facts": [
                    {"key": "unconscious", "value": "true"},
                    {"key": "breathing", "value": "none"}
                ]
            }
        }
    }

class EvaluateCrisisResponse(BaseModel):
    session_token: str = Field(..., description="Session token")
    domain: str = Field(..., description="Crisis domain")
    severity: str = Field(..., description="Assessed severity level: critical, high, moderate, low, informational")
    action_headline: str = Field(..., description="Primary life-saving action directive")
    reasons: List[str] = Field(default_factory=list, description="Deterministic logical explanations")
    prohibited_actions: List[str] = Field(default_factory=list, description="Strict life-safety prohibitions (never do)")
    evaluation_latency_ms: int = Field(0, description="Inference latency in milliseconds")

    model_config = {
        "json_schema_extra": {
            "example": {
                "session_token": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
                "domain": "medical",
                "severity": "critical",
                "action_headline": "begin_cpr_and_call_emergency",
                "reasons": [
                    "Victim is unconscious and unresponsive with absent respiration.",
                    "Immediate chest compressions (100-120 BPM) required."
                ],
                "prohibited_actions": [
                    "Do not give oral fluids or medications.",
                    "Do not delay CPR to search for a pulse if untrained."
                ],
                "evaluation_latency_ms": 2
            }
        }
    }

class BatchEvaluateCrisisRequest(BaseModel):
    evaluations: List[EvaluateCrisisRequest] = Field(..., min_length=1, description="Array of evaluation requests")
