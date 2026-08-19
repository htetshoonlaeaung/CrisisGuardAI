# backend/app/api/v1/endpoints/shelters.py
# Emergency shelter geolocation endpoint

from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.api.deps import get_shelter_service_dep
from app.services.shelter_service import ShelterService
from app.domain.schemas.shelter import ShelterResponse, ShelterListResponse

router = APIRouter(prefix="/shelters", tags=["Emergency Shelters"])

@router.get(
    "/nearby",
    response_model=ShelterListResponse,
    status_code=status.HTTP_200_OK,
    summary="Find nearby emergency shelters"
)
async def get_nearby_shelters(
    lat: float = Query(..., description="User latitude coordinate"),
    lng: float = Query(..., description="User longitude coordinate"),
    radius_km: float = Query(10.0, description="Search radius in kilometers"),
    disaster_type: Optional[str] = Query(None, description="Filter by disaster type"),
    db: AsyncSession = Depends(get_db),
    shelter_service: ShelterService = Depends(get_shelter_service_dep)
):
    """
    Computes nearby active emergency shelters using Haversine great-circle distance.
    """
    return await shelter_service.get_nearby_shelters(
        lat=lat,
        lng=lng,
        radius_km=radius_km,
        disaster_type=disaster_type,
        db=db
    )

@router.get(
    "/{id}",
    response_model=ShelterResponse,
    status_code=status.HTTP_200_OK,
    summary="Get single shelter details by ID"
)
async def get_shelter_by_id(
    id: int,
    db: AsyncSession = Depends(get_db),
    shelter_service: ShelterService = Depends(get_shelter_service_dep)
):
    """
    Retrieves information on a specific emergency shelter by ID.
    """
    shelter = await shelter_service.get_shelter_by_id(shelter_id=id, db=db)
    if shelter is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Shelter with id {id} not found"
        )
    return shelter
