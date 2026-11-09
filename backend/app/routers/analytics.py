from fastapi import APIRouter
from typing import Dict, Any, List
from app.services.simulation_engine import run_climate_economic_simulation
from app.services.financial_engine import calculate_farm_financials

router = APIRouter(prefix="/api/analytics", tags=["Simulation and Financials"])

@router.post("/simulate")
def simulate_scenarios(payload: Dict[str, Any]):
    crop_type = payload.get("crop_type", "Wheat")
    base_yield = float(payload.get("base_yield_ton", 2.8))
    base_cost = float(payload.get("base_cost_egp", 9500.0))
    base_price = float(payload.get("base_price_egp", 10000.0))
    temp_anomaly_c = float(payload.get("temp_anomaly_c", 2.0))
    water_reduction_pct = float(payload.get("water_reduction_pct", 20.0))
    cost_increase_pct = float(payload.get("cost_increase_pct", 10.0))
    price_change_pct = float(payload.get("price_change_pct", 0.0))

    sim_res = run_climate_economic_simulation(
        crop_type=crop_type,
        base_yield_ton=base_yield,
        base_cost_egp=base_cost,
        base_price_egp=base_price,
        temp_anomaly_c=temp_anomaly_c,
        water_reduction_pct=water_reduction_pct,
        cost_increase_pct=cost_increase_pct,
        price_change_pct=price_change_pct
    )
    return {
        "status": "success",
        "inputs": {
            "temp_anomaly_c": temp_anomaly_c,
            "water_reduction_pct": water_reduction_pct,
            "cost_increase_pct": cost_increase_pct
        },
        "simulation": sim_res
    }

@router.post("/financials")
def compute_financials(payload: Dict[str, Any]):
    seed_cost = float(payload.get("seed_cost", 1500.0))
    fertilizer_cost = float(payload.get("fertilizer_cost", 3200.0))
    irrigation_cost = float(payload.get("irrigation_cost", 1800.0))
    labor_cost = float(payload.get("labor_cost", 2000.0))
    machinery_cost = float(payload.get("machinery_cost", 1000.0))
    pesticide_cost = float(payload.get("pesticide_cost", 800.0))
    other_cost = float(payload.get("other_cost", 500.0))
    selling_price_per_ton = float(payload.get("selling_price_per_ton", 10000.0))
    expected_yield_ton = float(payload.get("expected_yield_ton", 2.8))
    currency = payload.get("currency", "EGP")

    res = calculate_farm_financials(
        seed_cost=seed_cost,
        fertilizer_cost=fertilizer_cost,
        irrigation_cost=irrigation_cost,
        labor_cost=labor_cost,
        machinery_cost=machinery_cost,
        pesticide_cost=pesticide_cost,
        other_cost=other_cost,
        selling_price_per_ton=selling_price_per_ton,
        expected_yield_ton=expected_yield_ton,
        currency=currency
    )
    return res
