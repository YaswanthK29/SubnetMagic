from fastapi import APIRouter, HTTPException

from app.models.schemas import VLSMRequest
from app.services.vlsm_service import calculate_vlsm

router = APIRouter()


@router.post("/vlsm")
def vlsm_endpoint(request: VLSMRequest):
    try:
        return calculate_vlsm(request.network, request.hosts)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
