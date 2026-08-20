from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, JSON
from sqlalchemy.dialects.postgresql import JSONB
from app.core.database import Base

def utc_now():
    return datetime.now(timezone.utc)

class EmergencyShelter(Base):
    __tablename__ = "emergency_shelters"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    disaster_type = Column(String(50), nullable=False)
    address = Column(String(255), nullable=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    capacity = Column(Integer, nullable=False)
    current_occupancy = Column(Integer, default=0, nullable=False)
    contact_phone = Column(String(50), nullable=False)
    is_open = Column(Boolean, default=True, nullable=False)
    facilities = Column(JSON().with_variant(JSONB, "postgresql"), nullable=True)
    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)

