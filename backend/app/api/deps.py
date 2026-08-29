# backend/app/api/deps.py
# Shared FastAPI dependency injection helpers

from app.core.database import get_db
from app.prolog.engine import get_prolog_engine, PrologEngineBridge
from app.services.triage_service import triage_service, TriageService
from app.services.shelter_service import shelter_service, ShelterService
from app.prolog.scheduler import clpfd_scheduler, CLPFDScheduler

def get_triage_service_dep() -> TriageService:
    return triage_service

def get_shelter_service_dep() -> ShelterService:
    return shelter_service

def get_scheduler_dep() -> CLPFDScheduler:
    return clpfd_scheduler

__all__ = [
    "get_db",
    "get_prolog_engine",
    "PrologEngineBridge",
    "get_triage_service_dep",
    "get_shelter_service_dep",
    "get_scheduler_dep",
]
