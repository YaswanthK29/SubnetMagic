from fastapi import APIRouter, HTTPException

from app.services.quiz_service import get_random_question

router = APIRouter()


@router.get("/quiz")
def quiz_endpoint():
    try:
        return get_random_question()
    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))
