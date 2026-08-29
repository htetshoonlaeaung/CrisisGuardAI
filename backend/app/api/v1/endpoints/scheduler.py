# backend/app/api/v1/endpoints/scheduler.py
# CLP(FD) constraint logic scheduling endpoint

from fastapi import APIRouter, Depends, status
from app.api.deps import get_scheduler_dep
from app.prolog.scheduler import CLPFDScheduler
from app.domain.schemas.scheduler import (
    OptimizeScheduleRequest,
    OptimizeScheduleResponse,
    DispatchSchedulerRequest,
    DispatchResponse,
)

router = APIRouter(prefix="/scheduler", tags=["Rescue Scheduler"])

@router.post(
    "/optimize",
    response_model=OptimizeScheduleResponse,
    status_code=status.HTTP_200_OK,
    summary="Optimize rescue team assignments via CLP(FD)"
)
async def optimize_schedule(
    request: OptimizeScheduleRequest,
    scheduler: CLPFDScheduler = Depends(get_scheduler_dep)
):
    """
    Solves rescue team allocation using SWI-Prolog CLP(FD) constraint solver.
    Ensures critical incidents are assigned to advanced paramedic units (Teams 1-2).
    """
    result = scheduler.schedule_rescue(
        incident_severities=request.incident_severities,
        team_capacities=request.team_capacities,
        max_time=request.max_time or 60
    )
    return OptimizeScheduleResponse(**result)

@router.post(
    "/dispatch",
    response_model=DispatchResponse,
    status_code=status.HTTP_200_OK,
    summary="Resolve multi-criteria rescue fleet allocation via CLP(FD) constraint solver"
)
async def dispatch_schedule(
    request: DispatchSchedulerRequest,
    scheduler: CLPFDScheduler = Depends(get_scheduler_dep)
):
    """
    Solves multi-criteria incident response dispatching with vehicle capacity invariants,
    specialized medical/fire routing for critical emergencies, and arrival time estimation.
    """
    result = scheduler.solve_dispatch(
        incidents=request.incidents,
        teams=request.teams
    )
    return DispatchResponse(**result)
