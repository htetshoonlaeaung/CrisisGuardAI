# backend/app/services/shelter_service.py
# Geolocation query service for locating nearby emergency shelters.
# Queries the Neon PostgreSQL emergency_shelters table, filtered by
# disaster type and proximity using Haversine distance formula.

from sqlalchemy.ext.asyncio import AsyncSession

class ShelterService:
    async def get_nearby_shelters(
        self,
        lat: float,
        lon: float,
        radius_km: float,
        disaster_type: str,
        db: AsyncSession
    ):
        # TODO: Query emergency_shelters table filtered by disaster_type and is_open=True
        # TODO: Apply Haversine distance filter within radius_km
        # TODO: Return list of ShelterResponse objects sorted by proximity
        pass

shelter_service = ShelterService()
