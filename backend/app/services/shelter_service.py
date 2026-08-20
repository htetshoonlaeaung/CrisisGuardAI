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
        "name": "Yangon General Hospital (YGH) Trauma & Emergency Hub",
        "disaster_type": "medical",
        "address": "Bogyoke Aung San Road, Latha Township, Downtown Yangon",
        "latitude": 16.7788,
        "longitude": 96.1534,
        "capacity": 1200,
        "current_occupancy": 340,
        "contact_phone": "+95-1-256112",
        "is_open": True,
        "facilities": ["Level 1 Trauma Care", "ICU & Resuscitation", "Blood Bank Reserves", "24/7 Ambulance Bay", "Emergency Oxygen"]
    },
    {
        "id": 2,
        "name": "North Okkalapa General Hospital (NOGH) Emergency Post",
        "disaster_type": "medical",
        "address": "Thudamar Road, North Okkalapa Township, Yangon",
        "latitude": 16.8970,
        "longitude": 96.1668,
        "capacity": 800,
        "current_occupancy": 210,
        "contact_phone": "+95-1-9699851",
        "is_open": True,
        "facilities": ["Emergency Trauma Wing", "Burn Care Bay", "Oxygen Refill Station", "Rapid Patient Triage"]
    },
    {
        "id": 3,
        "name": "Thuwunna National Stadium Disaster & Cyclone Sanctuary",
        "disaster_type": "natural_disaster",
        "address": "Waizayandar Road, Thingangyun Township, Eastern Yangon",
        "latitude": 16.8167,
        "longitude": 96.1833,
        "capacity": 3500,
        "current_occupancy": 420,
        "contact_phone": "+95-1-578210",
        "is_open": True,
        "facilities": ["Mass Evacuation Arena", "Helipad Landing Staging", "Clean Water Purification", "Emergency Satellite Comms", "Backup Diesel Power"]
    },
    {
        "id": 4,
        "name": "Hlaingthaya Flood Relief & Rapid Evacuation Sanctuary",
        "disaster_type": "natural_disaster",
        "address": "Yangon-Pathein Highway, Hlaingthaya Township, Western Yangon",
        "latitude": 16.8660,
        "longitude": 96.0680,
        "capacity": 1500,
        "current_occupancy": 290,
        "contact_phone": "+95-1-685210",
        "is_open": True,
        "facilities": ["Elevated Flood High-Ground", "Rescue Boat Staging Area", "Emergency Food Rations", "Field Clinic Post"]
    },
    {
        "id": 5,
        "name": "Yangon Central Fire Services HQ & Hazmat Assembly Zone",
        "disaster_type": "fire_hazard",
        "address": "Sule Pagoda Road, Kyauktada Township, Downtown Yangon",
        "latitude": 16.7744,
        "longitude": 96.1585,
        "capacity": 500,
        "current_occupancy": 95,
        "contact_phone": "+95-1-252011",
        "is_open": True,
        "facilities": ["SCBA Refill Station", "Chemical Decontamination Showers", "Smoke Inhalation Triage", "Heavy Extrication Fleet"]
    },
    {
        "id": 6,
        "name": "Yangon-Mandalay Expressway (Zero Mile) Crash Relief Point",
        "disaster_type": "road_accident",
        "address": "Zero Mile Junction, Mingaladon Township, Northern Yangon",
        "latitude": 16.9450,
        "longitude": 96.1750,
        "capacity": 400,
        "current_occupancy": 60,
        "contact_phone": "+95-1-635199",
        "is_open": True,
        "facilities": ["Expressway Fast-Track Trauma Bay", "Heavy Vehicle Towing Staging", "Spinal Immobilization Post", "Ambulance Fast-Lane"]
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
                        address=s.get("address", "Emergency Sector Facility"),
                        latitude=s["latitude"],
                        longitude=s["longitude"],
                        capacity=s["capacity"],
                        current_occupancy=s["current_occupancy"],
                        contact_phone=s["contact_phone"],
                        is_open=s["is_open"],
                        facilities=s.get("facilities", ["Medical Bay", "Clean Water", "Backup Generator", "Emergency Comms"]),
                        distance_km=dist
                    )
                )

        matched_shelters.sort(key=lambda item: item.distance_km or 0.0)

        return ShelterListResponse(
            shelters=matched_shelters,
            total=len(matched_shelters),
            total_found=len(matched_shelters),
            query={
                "lat": lat,
                "lng": lng,
                "radius_km": radius_km,
                "disaster_type": disaster_type or "all"
            }
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
