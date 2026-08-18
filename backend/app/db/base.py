# backend/app/db/base.py
# Imports all SQLAlchemy models so Alembic migration auto-detection can find them.

from app.db.models.session import EmergencySession  # noqa: F401
from app.db.models.audit import TriageAuditTrail     # noqa: F401
from app.db.models.fact import SessionFact           # noqa: F401
from app.db.models.shelter import EmergencyShelter   # noqa: F401
