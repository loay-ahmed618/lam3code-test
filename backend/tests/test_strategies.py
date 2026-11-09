import pytest
from app.services.strategy_engine import generate_strategies_for_field

def test_generate_three_strategies_wheat():
    goal_weights = {"yield": 50.0, "water": 30.0, "soil": 20.0}
    strategies = generate_strategies_for_field(
        crop_type="Wheat",
        area_feddan=10.0,
        goal_weights=goal_weights,
        constraints={},
        weather_summary={}
    )
    assert len(strategies) == 3
    codes = [s["strategy_code"] for s in strategies]
    assert "STRATEGY_A" in codes
    assert "STRATEGY_B" in codes
    assert "STRATEGY_C" in codes

def test_strategy_b_or_c_prioritizes_water():
    goal_weights = {"water": 80.0, "yield": 20.0}
    strategies = generate_strategies_for_field(
        crop_type="Wheat",
        area_feddan=10.0,
        goal_weights=goal_weights,
        constraints={},
        weather_summary={}
    )
    top_strat = strategies[0]
    # Strategy C or B uses significantly less water than Conventional flood Strategy A
    assert top_strat["strategy_code"] in ["STRATEGY_B", "STRATEGY_C"]
    assert top_strat["rank"] == 1

def test_infeasible_strategy_flagged():
    # Set water quota to 2000 m3/feddan (less than baseline ~2760 m3/feddan)
    constraints = {
        "water_quota_m3_per_feddan": 2000.0,
        "is_water_quota_hard": True
    }
    goal_weights = {"yield": 100.0}
    strategies = generate_strategies_for_field(
        crop_type="Wheat",
        area_feddan=10.0,
        goal_weights=goal_weights,
        constraints=constraints,
        weather_summary={}
    )
    strat_a = next(s for s in strategies if s["strategy_code"] == "STRATEGY_A")
    assert strat_a["is_feasible"] is False
    assert len(strat_a["violated_constraints"]) > 0
    # Infeasible strategies should have a final score of 0
    assert strat_a["final_score"] == 0.0
