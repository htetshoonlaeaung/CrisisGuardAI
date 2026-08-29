# backend/app/db/models/audit.py
# SQLAlchemy ORM model for TriageAuditTrail table in Neon PostgreSQL.

from datetime import datetime, timezone
from sqlalchemy import Column, BigInteger, Integer, String, DateTime, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from app.core.database import Base

def utc_now():
    return datetime.now(timezone.utc)

class TriageAuditTrail(Base):
    __tablename__ = "triage_audit_trails"

    id = Column(BigInteger().with_variant(Integer, "sqlite"), primary_key=True, autoincrement=True)
    session_id = Column(UUID(as_uuid=True), ForeignKey("emergency_sessions.id", ondelete="CASCADE"), nullable=False, index=True)
    recommended_action = Column(String(255), nullable=False)
    severity = Column(String(20), nullable=False)
    reasons = Column(JSON().with_variant(JSONB, "postgresql"), nullable=False)
    prohibited_actions = Column(JSON().with_variant(JSONB, "postgresql"), nullable=False)
    evaluation_latency_ms = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)

    session = relationship("EmergencySession", back_populates="audits")
