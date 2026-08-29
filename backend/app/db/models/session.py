# backend/app/db/models/session.py
# SQLAlchemy ORM model for EmergencySession table in Neon PostgreSQL.

import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Boolean, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.core.database import Base

def utc_now():
    return datetime.now(timezone.utc)

class EmergencySession(Base):
    __tablename__ = "emergency_sessions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_token = Column(String(64), unique=True, nullable=False, index=True)
    domain = Column(String(50), nullable=False)
    current_severity = Column(String(20), default="moderate", nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=utc_now, onupdate=utc_now, nullable=False)

    facts = relationship("SessionFact", back_populates="session", cascade="all, delete-orphan", lazy="selectin")
    audits = relationship("TriageAuditTrail", back_populates="session", cascade="all, delete-orphan", lazy="selectin")
