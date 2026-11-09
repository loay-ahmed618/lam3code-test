def calculate_farm_financials(seed_cost, fertilizer_cost, irrigation_cost, labor_cost, machinery_cost, pesticide_cost, other_cost, selling_price_per_ton, expected_yield_ton, currency="EGP"):
    total_cost = seed_cost + fertilizer_cost + irrigation_cost + labor_cost + machinery_cost + pesticide_cost + other_cost
    gross_revenue = expected_yield_ton * selling_price_per_ton
    net_profit = gross_revenue - total_cost
    breakeven_price = (total_cost / expected_yield_ton) if expected_yield_ton > 0 else 0.0
    breakeven_yield = (total_cost / selling_price_per_ton) if selling_price_per_ton > 0 else 0.0
    return {
        "currency": currency,
        "total_cost": round(total_cost, 2),
        "gross_revenue": round(gross_revenue, 2),
        "net_profit": round(net_profit, 2),
        "breakeven_price_per_ton": round(breakeven_price, 2),
        "breakeven_yield_ton": round(breakeven_yield, 2)
    }
