from fastapi import APIRouter
from typing import Dict, Any
from app.services.strategy_engine import generate_strategies_for_field

router = APIRouter(prefix="/api/strategies", tags=["Strategies"])

@router.post("/evaluate")
def evaluate_strategies(payload: Dict[str, Any]):
    crop_type = payload.get("crop_type", "Wheat (Giza 171)")
    area_feddan = float(payload.get("area_feddan", 12.4))
    goal_weights = payload.get("goal_weights", {
        "yield": 35.0,
        "water": 25.0,
        "soil": 15.0,
        "profit": 15.0,
        "climate": 5.0,
        "inputs": 5.0
    })
    constraints = payload.get("constraints", {})
    weather_summary = payload.get("weather_summary", {})

    ranked_strategies = generate_strategies_for_field(
        crop_type=crop_type,
        area_feddan=area_feddan,
        goal_weights=goal_weights,
        constraints=constraints,
        weather_summary=weather_summary
    )
    return {
        "status": "success",
        "crop_type": crop_type,
        "area_feddan": area_feddan,
        "strategies": ranked_strategies
    }
