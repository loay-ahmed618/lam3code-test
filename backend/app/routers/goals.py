from fastapi import APIRouter
from typing import Dict, Any
from app.services.goal_engine import CORE_GOALS, validate_goal_weights, normalize_weights_proportional

router = APIRouter(prefix="/api/goals", tags=["Goals"])

@router.get("/definitions")
def get_available_goals():
    return CORE_GOALS

@router.post("/validate")
def validate_weights(payload: Dict[str, Any]):
    weights = payload.get("goal_weights", {})
    validated = validate_goal_weights(weights)
    return {"status": "valid", "goal_weights": validated}

@router.post("/normalize")
def normalize_weights(payload: Dict[str, Any]):
    weights = payload.get("goal_weights", {})
    normalized = normalize_weights_proportional(weights)
    return {"status": "success", "goal_weights": normalized}
