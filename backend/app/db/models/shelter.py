# backend/app/db/models/shelter.py
# SQLAlchemy ORM model for EmergencyShelter table in Neon PostgreSQL.

from sqlalchemy import Column, Integer, String, Float, Boolean
from app.core.database import Base

class EmergencyShelter(Base):
    __tablename__ = "emergency_shelters"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    disaster_type = Column(String(50), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    capacity = Column(Integer, nullable=False)
    current_occupancy = Column(Integer, default=0, nullable=False)
    contact_phone = Column(String(50), nullable=False)
    is_open = Column(Boolean, default=True, nullable=False)
