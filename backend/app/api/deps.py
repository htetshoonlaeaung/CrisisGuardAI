# backend/app/api/deps.py
# Shared FastAPI dependency injection helpers
# Provides reusable DB session and authentication dependencies across all endpoints.

from app.core.database import get_db

# Re-export get_db for convenience
__all__ = ["get_db"]

# TODO: Add auth dependency (e.g., get_current_user) when authentication is implemented
