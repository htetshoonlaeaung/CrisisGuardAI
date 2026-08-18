# backend/app/api/v1/api_router.py
# Aggregates all v1 endpoint routers into a single router mounted at /api/v1

from fastapi import APIRouter

api_router = APIRouter(prefix="/api/v1")

# TODO: Include crisis, sessions, shelters, scheduler, health routers
