# backend/app/db/models/fact.py
# SQLAlchemy ORM model for SessionFact table in Neon PostgreSQL.

from datetime import datetime, timezone
from sqlalchemy import Column, BigInteger, Integer, String, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.core.database import Base

def utc_now():
    return datetime.now(timezone.utc)

class SessionFact(Base):
    __tablename__ = "session_facts"

    id = Column(BigInteger().with_variant(Integer, "sqlite"), primary_key=True, autoincrement=True)
    session_id = Column(UUID(as_uuid=True), ForeignKey("emergency_sessions.id", ondelete="CASCADE"), nullable=False, index=True)
    fact_key = Column(String(100), nullable=False)
    fact_value = Column(String(100), nullable=False)
    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)

    session = relationship("EmergencySession", back_populates="facts")
