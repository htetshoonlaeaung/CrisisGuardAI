# backend/app/services/shelter_service.py
# Geolocation query service for locating nearby emergency shelters.

import math
from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models.shelter import EmergencyShelter
from app.domain.schemas.shelter import ShelterResponse, ShelterListResponse

# Pre-seeded reference shelters for emergency resilience
DEFAULT_SHELTERS = [
    {
        "id": 1,
        "name": "Central Emergency Relief & Evacuation Hub",
        "disaster_type": "natural_disaster",
        "latitude": 16.8661,
        "longitude": 96.1951,
        "capacity": 1000,
        "current_occupancy": 150,
        "contact_phone": "+95-1-234567",
        "is_open": True
    },
    {
        "id": 2,
        "name": "North Metro Disaster Shelter & Medical Post",
        "disaster_type": "natural_disaster",
        "latitude": 16.8750,
        "longitude": 96.1800,
        "capacity": 500,
        "current_occupancy": 80,
        "contact_phone": "+95-1-890123",
        "is_open": True
    },
    {
        "id": 3,
        "name": "Industrial Hazard & Chemical Safe Haven",
        "disaster_type": "fire_hazard",
        "latitude": 16.8500,
        "longitude": 96.2050,
        "capacity": 300,
        "current_occupancy": 40,
        "contact_phone": "+95-1-567890",
        "is_open": True
    },
    {
        "id": 4,
        "name": "General Trauma & Emergency Triage Center",
        "disaster_type": "medical",
        "latitude": 16.8600,
        "longitude": 96.1900,
        "capacity": 400,
        "current_occupancy": 110,
        "contact_phone": "+95-1-345678",
        "is_open": True
    }
]

def haversine_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Computes great-circle distance between two GPS coordinates in kilometers.
    """
    r = 6371.0  # Earth radius in kilometers
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (
        math.sin(dlat / 2) ** 2
        + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2) ** 2
    )
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(r * c, 2)

class ShelterService:
    """
    Manages shelter geolocation queries, capacity tracking, and Haversine proximity calculations.
    """

    async def get_nearby_shelters(
        self,
        lat: float,
        lng: float,
        radius_km: float = 10.0,
        disaster_type: Optional[str] = None,
        db: Optional[AsyncSession] = None
    ) -> ShelterListResponse:
        """
        Queries open shelters within radius_km sorted by distance.
        """
        all_shelters_data = []

        if db is not None:
            try:
                stmt = select(EmergencyShelter).where(EmergencyShelter.is_open == True)
                if disaster_type:
                    stmt = stmt.where(EmergencyShelter.disaster_type == disaster_type)
                result = await db.execute(stmt)
                db_shelters = result.scalars().all()
                for s in db_shelters:
                    all_shelters_data.append({
                        "id": s.id,
                        "name": s.name,
                        "disaster_type": s.disaster_type,
                        "latitude": s.latitude,
                        "longitude": s.longitude,
                        "capacity": s.capacity,
                        "current_occupancy": s.current_occupancy,
                        "contact_phone": s.contact_phone,
                        "is_open": s.is_open,
                    })
            except Exception:
                pass

        if not all_shelters_data:
            # Use seed shelters
            for s in DEFAULT_SHELTERS:
                if disaster_type is None or s["disaster_type"] == disaster_type:
                    all_shelters_data.append(s)

        matched_shelters: List[ShelterResponse] = []
        for s in all_shelters_data:
            dist = haversine_distance_km(lat, lng, s["latitude"], s["longitude"])
            if dist <= radius_km:
                matched_shelters.append(
                    ShelterResponse(
                        id=s["id"],
                        name=s["name"],
                        disaster_type=s["disaster_type"],
                        latitude=s["latitude"],
                        longitude=s["longitude"],
                        capacity=s["capacity"],
                        current_occupancy=s["current_occupancy"],
                        contact_phone=s["contact_phone"],
                        is_open=s["is_open"],
                        distance_km=dist
                    )
                )

        matched_shelters.sort(key=lambda item: item.distance_km or 0.0)

        return ShelterListResponse(
            shelters=matched_shelters,
            total=len(matched_shelters)
        )

    async def get_shelter_by_id(
        self,
        shelter_id: int,
        db: Optional[AsyncSession] = None
    ) -> Optional[ShelterResponse]:
        """
        Retrieves a single shelter by ID.
        """
        if db is not None:
            try:
                stmt = select(EmergencyShelter).where(EmergencyShelter.id == shelter_id)
                result = await db.execute(stmt)
                s = result.scalar_one_or_none()
                if s is not None:
                    return ShelterResponse.model_validate(s)
            except Exception:
                pass

        for s in DEFAULT_SHELTERS:
            if s["id"] == shelter_id:
                return ShelterResponse(**s)

        return None

shelter_service = ShelterService()
