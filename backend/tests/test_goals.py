import pytest
from fastapi import HTTPException
from app.services.goal_engine import validate_goal_weights, normalize_weights_proportional, check_hard_constraints

def test_weights_sum_100_valid():
    weights = {"yield": 40.0, "water": 30.0, "soil": 20.0, "profit": 10.0}
    validated = validate_goal_weights(weights)
    assert validated == weights

def test_weights_sum_less_than_100_invalid():
    weights = {"yield": 40.0, "water": 30.0}
    with pytest.raises(HTTPException) as excinfo:
        validate_goal_weights(weights)
    assert excinfo.value.status_code == 400
    assert "must equal exactly 100%" in excinfo.value.detail

def test_weights_sum_more_than_100_invalid():
    weights = {"yield": 60.0, "water": 50.0}
    with pytest.raises(HTTPException) as excinfo:
        validate_goal_weights(weights)
    assert excinfo.value.status_code == 400
    assert "must equal exactly 100%" in excinfo.value.detail

def test_negative_weight_invalid():
    weights = {"yield": 110.0, "water": -10.0}
    with pytest.raises(HTTPException) as excinfo:
        validate_goal_weights(weights)
    assert excinfo.value.status_code == 400
    assert "cannot be negative" in excinfo.value.detail

def test_hard_water_constraint_violation():
    strat_metrics = {"water_use_m3_per_feddan": 3200.0, "production_cost_egp_per_feddan": 10000.0}
    constraints = {"water_quota_m3_per_feddan": 2500.0, "is_water_quota_hard": True}
    violations = check_hard_constraints(strat_metrics, constraints)
    assert len(violations) == 1
    assert "Violates hard water quota" in violations[0]

def test_hard_budget_constraint_violation():
    strat_metrics = {"water_use_m3_per_feddan": 2000.0, "production_cost_egp_per_feddan": 14000.0}
    constraints = {"max_budget_egp_per_feddan": 12000.0, "is_budget_hard": True}
    violations = check_hard_constraints(strat_metrics, constraints)
    assert len(violations) == 1
    assert "Violates hard budget ceiling" in violations[0]

def test_soft_constraint_does_not_violate():
    strat_metrics = {"water_use_m3_per_feddan": 3200.0, "production_cost_egp_per_feddan": 10000.0}
    constraints = {"water_quota_m3_per_feddan": 2500.0, "is_water_quota_hard": False}
    violations = check_hard_constraints(strat_metrics, constraints)
    assert len(violations) == 0
