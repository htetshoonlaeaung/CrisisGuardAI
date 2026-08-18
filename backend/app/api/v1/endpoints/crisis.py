# backend/app/api/v1/endpoints/crisis.py
# Emergency triage & evaluation endpoint
# Accepts submitted facts from the frontend, delegates to the triage service,
# and returns the Prolog-derived action, severity level, reasons, and prohibitions.

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db

router = APIRouter(prefix="/crisis", tags=["Crisis Triage"])

# TODO: POST /evaluate — receives facts, calls triage_service, returns triage response
