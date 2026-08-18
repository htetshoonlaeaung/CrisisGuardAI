# backend/app/api/v1/endpoints/shelters.py
# Emergency shelter geolocation endpoint
# Queries the Neon DB for nearby emergency shelters filtered by disaster type and proximity.

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db

router = APIRouter(prefix="/shelters", tags=["Emergency Shelters"])

# TODO: GET /shelters        — list all open shelters
# TODO: GET /shelters/nearby — query shelters by lat/lon and disaster type
