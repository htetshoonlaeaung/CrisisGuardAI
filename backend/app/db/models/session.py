# backend/app/db/models/session.py
# SQLAlchemy ORM models for EmergencySession and SessionFact tables in Neon PostgreSQL.
# EmergencySession tracks active crisis context. SessionFact stores submitted Prolog facts.

from app.core.database import Base

# TODO: Define EmergencySession model (id, session_token, domain, current_severity, is_active, timestamps)
# TODO: Define SessionFact model (id, session_id FK, fact_key, fact_value, created_at)
