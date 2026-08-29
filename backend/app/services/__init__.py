# backend/app/services/__init__.py
# Export core services

from app.services.triage_service import triage_service, TriageService
from app.services.shelter_service import shelter_service, ShelterService
from app.services.prolog_engine import prolog_bridge, PrologEngineBridge, get_prolog_engine

__all__ = [
    "triage_service",
    "TriageService",
    "shelter_service",
    "ShelterService",
    "prolog_bridge",
    "PrologEngineBridge",
    "get_prolog_engine",
]
