import json
import random
from functools import lru_cache
from pathlib import Path
from typing import Any

DATA_PATH = Path(__file__).resolve().parent.parent / "data" / "subnet_questions.json"


@lru_cache(maxsize=1)
def _load_question_bank() -> list[dict[str, Any]]:
    with DATA_PATH.open(encoding="utf-8") as file:
        data = json.load(file)

    questions: list[dict[str, Any]] = []
    for difficulty, items in data.get("questions", {}).items():
        for index, item in enumerate(items):
            questions.append({
                "id": f"{difficulty}-{index}",
                "difficulty": difficulty,
                **item,
            })

    if not questions:
        raise ValueError("Question bank is empty.")

    return questions


def get_random_question() -> dict[str, Any]:
    question = random.choice(_load_question_bank())
    return {
        "id": question["id"],
        "difficulty": question["difficulty"],
        "question": question["question"],
        "options": question["options"],
        "answer": question["answer"],
        "explanation": question["explanation"],
    }
