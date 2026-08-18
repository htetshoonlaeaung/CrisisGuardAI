# backend/app/api/v1/endpoints/sessions.py
# Active emergency session lifecycle endpoint
# Creates, retrieves, and closes emergency sessions persisted in Neon PostgreSQL.

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db

router = APIRouter(prefix="/sessions", tags=["Emergency Sessions"])

# TODO: POST /sessions       — create a new emergency session
# TODO: GET  /sessions/{id}  — fetch an active session with its submitted facts
# TODO: DELETE /sessions/{id} — close/deactivate an emergency session
