from typing import Dict, Any, List
from fastapi import HTTPException

CORE_GOALS = [
    {"id": "yield", "name_en": "Yield Maximization", "name_ar": "تعظيم الإنتاجية"},
    {"id": "water", "name_en": "Water Efficiency", "name_ar": "كفاءة استخدام المياه"},
    {"id": "soil", "name_en": "Soil Health & Preservation", "name_ar": "صحة التربة واستدامتها"},
    {"id": "profit", "name_en": "Profitability & Margin", "name_ar": "الربحية وخفض التكاليف"},
    {"id": "climate", "name_en": "Climate Resilience", "name_ar": "المرونة المناخية"},
    {"id": "inputs", "name_en": "Lower Input Dependency", "name_ar": "تقليل الاعتماد على الكيماويات"}
]

def validate_goal_weights(weights: Dict[str, float]) -> Dict[str, float]:
    total = sum(weights.values())
    for k, v in weights.items():
        if v < 0:
            raise HTTPException(status_code=400, detail=f"Weight for goal '{k}' cannot be negative.")
    if abs(total - 100.0) > 0.5:
        raise HTTPException(status_code=400, detail=f"Total weights must equal exactly 100%. Currently: {round(total, 1)}%")
    return weights

def normalize_weights_proportional(weights: Dict[str, float]) -> Dict[str, float]:
    total = sum(weights.values())
    if total <= 0:
        n = len(weights)
        return {k: round(100.0 / n, 2) for k in weights}
    return {k: round((v / total) * 100.0, 2) for k, v in weights.items()}

def check_hard_constraints(strategy_metrics: Dict[str, float], constraints: Dict[str, Any]) -> List[str]:
    violations = []
    water_quota = constraints.get("water_quota_m3_per_feddan")
    if water_quota is not None and constraints.get("is_water_quota_hard", True):
        strategy_water = strategy_metrics.get("water_use_m3_per_feddan", 0)
        if strategy_water > water_quota:
            violations.append(f"Violates hard water quota: Requires {strategy_water:.0f} m³/feddan, exceeding limit of {water_quota:.0f} m³/feddan.")
    max_budget = constraints.get("max_budget_egp_per_feddan")
    if max_budget is not None and constraints.get("is_budget_hard", True):
        strategy_cost = strategy_metrics.get("production_cost_egp_per_feddan", 0)
        if strategy_cost > max_budget:
            violations.append(f"Violates hard budget ceiling: Cost of {strategy_cost:.0f} EGP/feddan exceeds allowed budget of {max_budget:.0f} EGP/feddan.")
    return violations
