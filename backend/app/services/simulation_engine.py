def run_climate_economic_simulation(crop_type, base_yield_ton, base_cost_egp, base_price_egp, temp_anomaly_c, water_reduction_pct, cost_increase_pct, price_change_pct):
    temp_penalty = min(40.0, temp_anomaly_c * 4.5) if temp_anomaly_c > 0 else 0.0
    water_penalty = min(50.0, water_reduction_pct * 0.75)
    total_yield_impact = -(temp_penalty + water_penalty)
    sim_yield = max(0.5, base_yield_ton * (1.0 + (total_yield_impact / 100.0)))
    sim_cost = base_cost_egp * (1.0 + (cost_increase_pct / 100.0))
    sim_price = base_price_egp * (1.0 + (price_change_pct / 100.0))
    sim_rev = sim_yield * sim_price
    sim_profit = sim_rev - sim_cost
    base_profit = (base_yield_ton * base_price_egp) - base_cost_egp
    profit_delta = ((sim_profit - base_profit) / abs(base_profit) * 100.0) if base_profit else 0.0
    return {
        "simulated_yield_ton": round(sim_yield, 2),
        "yield_change_pct": round(total_yield_impact, 1),
        "simulated_cost_egp": round(sim_cost, 0),
        "simulated_revenue_egp": round(sim_rev, 0),
        "simulated_net_profit_egp": round(sim_profit, 0),
        "profit_delta_pct": round(profit_delta, 1),
        "heat_stress_severity": "High" if temp_anomaly_c >= 3.0 else "Normal",
        "scientific_disclaimer": "Exploratory scenario model. Ground truthing required."
    }
