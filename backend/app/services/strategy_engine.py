from typing import List, Dict, Any
from app.services.goal_engine import check_hard_constraints

def generate_strategies_for_field(
    crop_type: str,
    area_feddan: float,
    goal_weights: Dict[str, float],
    constraints: Dict[str, Any],
    weather_summary: Dict[str, Any]
) -> List[Dict[str, Any]]:
    crop_lower = crop_type.lower()
    if "wheat" in crop_lower or "قمح" in crop_lower:
        base_yield, base_water, base_cost, base_price = 2.8, 2400.0, 9500.0, 10000.0
    elif "maize" in crop_lower or "ذرة" in crop_lower:
        base_yield, base_water, base_cost, base_price = 3.6, 3800.0, 11000.0, 8500.0
    elif "cotton" in crop_lower or "قطن" in crop_lower:
        base_yield, base_water, base_cost, base_price = 1.4, 4200.0, 14000.0, 15000.0
    else:
        base_yield, base_water, base_cost, base_price = 3.2, 3000.0, 11500.0, 9500.0

    strat_a = {
        "strategy_code": "STRATEGY_A",
        "name_en": "Strategy A — Conventional Flood & Inputs (Current Practice)",
        "name_ar": "الاستراتيجية (أ) — الممارسة التقليدية الحالية (ري سطحي بالغمر)",
        "description_en": "Conventional furrow flood irrigation with standard commercial NPK and scheduled pest spraying.",
        "description_ar": "الري بالغمر السطحي التقليدي مع نثار سماد اليوريا والمركبات الشائعة.",
        "expected_yield_ton_per_feddan": base_yield,
        "water_use_m3_per_feddan": base_water * 1.15,
        "soil_health_index": 52.0,
        "production_cost_egp_per_feddan": base_cost,
        "expected_net_profit_egp": (base_yield * base_price) - base_cost,
        "climate_risk_score": 68.0,
        "input_dependency_score": 75.0,
        "assumptions_en": ["Surface flood efficiency ~55%"],
        "assumptions_ar": ["كفاءة الري بالغمر 55%"],
        "tradeoffs_en": ["No hardware investment", "High water evaporation and salinity risk"],
        "tradeoffs_ar": ["لا تتطلب معدات متخصصة", "فواقد بخر وتملح مرتفعة"]
    }

    strat_b = {
        "strategy_code": "STRATEGY_B",
        "name_en": "Strategy B — Priority-Optimized Precision Fertigation",
        "name_ar": "الاستراتيجية (ب) — التسميد والري الدقيق الموجه للأهداف",
        "description_en": "Targeted precision irrigation with split fertigation doses aligned with crop phenology.",
        "description_ar": "استراتيجية موجهة للأهداف: ري دقيق وتسميد مجزأ لتعظيم الكفاءة.",
        "expected_yield_ton_per_feddan": base_yield * 1.25,
        "water_use_m3_per_feddan": base_water * 0.95,
        "soil_health_index": 70.0,
        "production_cost_egp_per_feddan": base_cost * 1.18,
        "expected_net_profit_egp": ((base_yield * 1.25) * base_price) - (base_cost * 1.18),
        "climate_risk_score": 45.0,
        "input_dependency_score": 65.0,
        "assumptions_en": ["High certified seed quality"],
        "assumptions_ar": ["تقاوي معتمدة عالية النقاوة"],
        "tradeoffs_en": ["Highest tonnage per feddan", "Requires working capital for inputs"],
        "tradeoffs_ar": ["أقصى كمية محصول", "تتطلب سيولة أكبر للمدخلات"]
    }

    strat_c = {
        "strategy_code": "STRATEGY_C",
        "name_en": "Strategy C — Climate-Resilient Integrated Agro-Ecology (Balanced)",
        "name_ar": "الاستراتيجية (ج) — الإدارة المتكاملة المرنة للمناخ (المتوازنة)",
        "description_en": "Balanced approach combining heat-tolerant cultivars, anti-transpirant sprays, and mulch.",
        "description_ar": "استراتيجية متوازنة: أصناف مقاومة للإجهاد الحراري، سليكات بوتاسيوم، وتغطية التربة.",
        "expected_yield_ton_per_feddan": base_yield * 1.15,
        "water_use_m3_per_feddan": base_water * 0.78,
        "soil_health_index": 85.0,
        "production_cost_egp_per_feddan": base_cost * 1.02,
        "expected_net_profit_egp": ((base_yield * 1.15) * base_price) - (base_cost * 1.02),
        "climate_risk_score": 25.0,
        "input_dependency_score": 40.0,
        "assumptions_en": ["Potassium silicate stress buffer applied"],
        "assumptions_ar": ["رش سليكات البوتاسيوم لتخفيف الإجهاد"],
        "tradeoffs_en": ["Robust resilience against weather extremes", "Moderate yield gains"],
        "tradeoffs_ar": ["ثبات ممتاز ضد تقلبات الطقس", "زيادة معتدلة في المحصول"]
    }

    candidates = [strat_a, strat_b, strat_c]
    for s in candidates:
        violations = check_hard_constraints(s, constraints)
        s["is_feasible"] = len(violations) == 0
        s["violated_constraints"] = violations

    max_y = max(s["expected_yield_ton_per_feddan"] for s in candidates) or 1.0
    min_w = min(s["water_use_m3_per_feddan"] for s in candidates)
    max_w = max(s["water_use_m3_per_feddan"] for s in candidates)
    max_p = max(s["expected_net_profit_egp"] for s in candidates)
    min_p = min(s["expected_net_profit_egp"] for s in candidates)

    w_y = goal_weights.get("yield", 0.0) / 100.0
    w_w = goal_weights.get("water", 0.0) / 100.0
    w_s = goal_weights.get("soil", 0.0) / 100.0
    w_p = goal_weights.get("profit", 0.0) / 100.0
    w_c = goal_weights.get("climate", 0.0) / 100.0
    w_i = goal_weights.get("inputs", 0.0) / 100.0

    scored = []
    for s in candidates:
        norm_y = round((s["expected_yield_ton_per_feddan"] / max_y) * 100.0, 1)
        norm_w = round(100.0 - (((s["water_use_m3_per_feddan"] - min_w) / (max_w - min_w + 1e-5)) * 60.0), 1)
        norm_s = round(s["soil_health_index"], 1)
        p_diff = (max_p - min_p) if (max_p - min_p) > 0 else 1.0
        norm_p = round(40.0 + (((s["expected_net_profit_egp"] - min_p) / p_diff) * 60.0), 1)
        norm_c = round(100.0 - s["climate_risk_score"], 1)
        norm_i = round(100.0 - s["input_dependency_score"], 1)

        if s["is_feasible"]:
            composite = norm_y * w_y + norm_w * w_w + norm_s * w_s + norm_p * w_p + norm_c * w_c + norm_i * w_i
        else:
            composite = 0.0

        s["norm_yield"] = norm_y
        s["norm_water"] = norm_w
        s["norm_soil"] = norm_s
        s["norm_profit"] = norm_p
        s["norm_climate"] = norm_c
        s["norm_inputs"] = norm_i
        s["final_score"] = round(composite, 1)

        if not s["is_feasible"]:
            expl_en = f"Infeasible: violates hard constraints ({', '.join(s['violated_constraints'])})."
            expl_ar = f"غير قابلة للتطبيق: تخالف القيود ({' ، '.join(s['violated_constraints'])})."
        else:
            expl_en = f"Ranks based on priorities. Yield: {s['expected_yield_ton_per_feddan']:.2f} t/fed, water: {s['water_use_m3_per_feddan']:.0f} m³."
            expl_ar = f"ترتيب وفق الأولويات. محصول: {s['expected_yield_ton_per_feddan']:.2f} طن/فدان، مياه: {s['water_use_m3_per_feddan']:.0f} م³."

        s["explanation_en"] = expl_en
        s["explanation_ar"] = expl_ar
        scored.append(s)

    scored.sort(key=lambda x: (x["is_feasible"], x["final_score"]), reverse=True)
    for idx, strat in enumerate(scored):
        strat["rank"] = idx + 1
    return scored
