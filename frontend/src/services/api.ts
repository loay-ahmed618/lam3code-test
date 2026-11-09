const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface FieldDto {
  id: number;
  farm_id: number;
  name: string;
  crop_type: string;
  season: string;
  planting_date: string;
  irrigation_system: string;
  soil_type: string;
  area_feddan: number;
  area_hectares: number;
  area_m2: number;
  center_lat: number;
  center_lon: number;
  polygon_geojson: Array<{ lat: number; lng: number }>;
}

export const api = {
  async getHealth() {
    try {
      const res = await fetch(`${API_BASE_URL}/api/health`);
      return await res.json();
    } catch {
      return { status: 'offline' };
    }
  },

  async getFields(): Promise<FieldDto[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/farms/1/fields`);
      if (!res.ok) throw new Error('Failed to fetch fields');
      return await res.json();
    } catch (err) {
      console.warn('API getFields fallback:', err);
      return [];
    }
  },

  async getEnvironmentalData(lat: number, lon: number) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/environmental/?lat=${lat}&lon=${lon}`);
      if (!res.ok) throw new Error('Environmental data fetch error');
      return await res.json();
    } catch (err) {
      console.warn('API getEnvironmentalData fallback:', err);
      return null;
    }
  },

  async evaluateStrategies(cropType: string, areaFeddan: number, goalWeights: Record<string, number>, constraints: any) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/strategies/evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          crop_type: cropType,
          area_feddan: areaFeddan,
          goal_weights: goalWeights,
          constraints: constraints,
        }),
      });
      if (!res.ok) throw new Error('Strategies evaluation error');
      return await res.json();
    } catch (err) {
      console.warn('API evaluateStrategies fallback:', err);
      return null;
    }
  },

  async simulateScenarios(params: {
    cropType: string;
    baseYieldTon: number;
    baseCostEgp: number;
    basePriceEgp: number;
    tempAnomalyC: number;
    waterReductionPct: number;
    costIncreasePct: number;
  }) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/analytics/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          crop_type: params.cropType,
          base_yield_ton: params.baseYieldTon,
          base_cost_egp: params.baseCostEgp,
          base_price_egp: params.basePriceEgp,
          temp_anomaly_c: params.tempAnomalyC,
          water_reduction_pct: params.waterReductionPct,
          cost_increase_pct: params.costIncreasePct,
        }),
      });
      if (!res.ok) throw new Error('Simulation API error');
      return await res.json();
    } catch (err) {
      console.warn('API simulateScenarios fallback:', err);
      return null;
    }
  },

  async computeFinancials(costs: Record<string, number>, expectedYieldTon: number, sellingPricePerTon: number) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/analytics/financials`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...costs,
          expected_yield_ton: expectedYieldTon,
          selling_price_per_ton: sellingPricePerTon,
          currency: 'EGP',
        }),
      });
      if (!res.ok) throw new Error('Financial calculation error');
      return await res.json();
    } catch (err) {
      console.warn('API computeFinancials fallback:', err);
      return null;
    }
  },

  async getReviews() {
    try {
      const res = await fetch(`${API_BASE_URL}/api/reviews/`);
      if (!res.ok) throw new Error('Reviews fetch error');
      return await res.json();
    } catch (err) {
      console.warn('API getReviews fallback:', err);
      return [];
    }
  },

  async submitReview(fieldId: number, status: string, notes: string) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/reviews/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ field_id: fieldId, status, notes }),
      });
      if (!res.ok) throw new Error('Submit review error');
      return await res.json();
    } catch (err) {
      console.warn('API submitReview fallback:', err);
      return null;
    }
  },
};
