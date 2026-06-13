from fastapi import APIRouter, HTTPException

from app.models.schemas import SubnetRequest
from app.services.subnet_service import calculate_subnet

router = APIRouter()


@router.post("/subnet")
def subnet_endpoint(request: SubnetRequest):
    try:
        return calculate_subnet(request.ip, request.cidr)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
