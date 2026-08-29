# backend/app/domain/schemas/shelter.py
# Pydantic v2 schemas for emergency shelter query requests and responses.

from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field

class ShelterQuery(BaseModel):
    lat: float = Field(..., ge=-90.0, le=90.0, description="Latitude coordinate (-90 to 90)")
    lng: float = Field(..., ge=-180.0, le=180.0, description="Longitude coordinate (-180 to 180)")
    radius_km: float = Field(10.0, gt=0.0, le=500.0, description="Search radius in kilometers")
    disaster_type: Optional[str] = Field(None, description="Optional disaster domain filter")

class ShelterResponse(BaseModel):
    id: int = Field(..., description="Unique shelter identifier")
    name: str = Field(..., description="Shelter facility name")
    disaster_type: str = Field(..., description="Disaster category supported")
    address: Optional[str] = Field("Emergency Sector Facility", description="Physical street location or landmark")
    latitude: float = Field(..., description="Shelter latitude")
    longitude: float = Field(..., description="Shelter longitude")
    capacity: int = Field(..., ge=0, description="Maximum occupant capacity")
    current_occupancy: int = Field(0, ge=0, description="Current occupant count")
    contact_phone: str = Field(..., description="Emergency contact phone number")
    is_open: bool = Field(True, description="Shelter active status")
    facilities: List[str] = Field(
        default_factory=lambda: ["Medical Bay", "Clean Water", "Backup Generator", "Emergency Comms"],
        description="Available on-site amenities and emergency resources"
    )
    distance_km: Optional[float] = Field(None, description="Calculated proximity distance from user in km")

    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "id": 1,
                "name": "Central Emergency Shelter",
                "disaster_type": "natural_disaster",
                "address": "Downtown Civic Zone 1",
                "latitude": 16.8661,
                "longitude": 96.1951,
                "capacity": 500,
                "current_occupancy": 120,
                "contact_phone": "+95-1-234567",
                "is_open": True,
                "facilities": ["Medical Bay", "Clean Water", "Backup Generator"],
                "distance_km": 2.3
            }
        }
    )

class ShelterListResponse(BaseModel):
    shelters: List[ShelterResponse] = Field(default_factory=list, description="Array of matching shelters")
    total: int = Field(0, description="Total matching shelters found")
    total_found: int = Field(0, description="Alias for total matching shelters found")
    query: Optional[dict] = Field(None, description="Echoed query filter parameters")
