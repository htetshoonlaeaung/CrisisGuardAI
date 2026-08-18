# backend/app/db/models/audit.py
# SQLAlchemy ORM model for TriageAuditTrail table in Neon PostgreSQL.
# Records every Prolog evaluation result as an immutable audit log entry
# for post-disaster analysis and compliance reporting.

from app.core.database import Base

# TODO: Define TriageAuditTrail model
#   - session_id (FK to emergency_sessions)
#   - recommended_action, severity
#   - reasons (JSONB), prohibited_actions (JSONB)
#   - evaluation_latency_ms, created_at
