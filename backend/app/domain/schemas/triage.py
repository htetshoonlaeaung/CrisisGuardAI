# backend/app/domain/schemas/triage.py
# Pydantic v2 schemas for the crisis triage request and response data contracts.
# These models validate all data entering and leaving the /crisis/evaluate endpoint.

from pydantic import BaseModel
from typing import List, Optional
from enum import Enum

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

# TODO: Define FactItem (key, value)
# TODO: Define EvaluateCrisisRequest (session_token, domain, submitted_facts)
# TODO: Define EvaluateCrisisResponse (session_token, domain, severity, action_headline, reasons, prohibited_actions, evaluation_latency_ms)
