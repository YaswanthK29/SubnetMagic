from fastapi import APIRouter, HTTPException

from app.models.schemas import WildcardRequest
from app.services.wildcard_service import calculate_wildcard

router = APIRouter()


@router.post("/wildcard")
def wildcard_endpoint(request: WildcardRequest):
    try:
        return calculate_wildcard(request.mask)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
