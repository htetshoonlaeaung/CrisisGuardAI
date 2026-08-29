# backend/app/domain/schemas/health.py
# Pydantic v2 schemas for system and Prolog health checks.

from pydantic import BaseModel

class HealthResponse(BaseModel):
    status: str = "healthy"
    version: str = "1.0.0"
    uptime_seconds: int = 0

class PrologHealthResponse(BaseModel):
    prolog_status: str = "ready"
    knowledge_bases_loaded: int = 7
    engine_ready: bool = True
