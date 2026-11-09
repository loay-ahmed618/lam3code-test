from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from app.models.entities import UserRole, ReviewStatus

class UserRegister(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: Optional[UserRole] = UserRole.FARMER

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user_id: int
    email: str
    full_name: str
    role: str

class FarmCreate(BaseModel):
    name: str
    country: str = "Egypt"
    region: str
    description: Optional[str] = None

class FieldCreate(BaseModel):
    name: str
    crop_type: str
    season: str
    planting_date: Optional[str] = None
    irrigation_system: str = "Surface / Flood"
    soil_type: str = "Clay Loam"
    polygon_geojson: Dict[str, Any]

class GoalProfileUpdate(BaseModel):
    weight_yield: float
    weight_water: float
    weight_soil: float
    weight_profit: float
    weight_climate: float
    weight_inputs: float
    water_quota_m3_per_feddan: Optional[float] = None
    is_water_quota_hard: bool = True
    max_budget_egp_per_feddan: Optional[float] = None
    is_budget_hard: bool = True
    available_labor_hours: Optional[float] = None
    equipment_restrictions: Optional[str] = None
    farmer_notes: Optional[str] = None

class SimulationRequest(BaseModel):
    scenario_type: str
    temp_anomaly_c: float = 0.0
    water_reduction_pct: float = 0.0
    cost_increase_pct: float = 0.0
    price_change_pct: float = 0.0

class FinancialUpdate(BaseModel):
    seed_cost: float = 0.0
    fertilizer_cost: float = 0.0
    irrigation_cost: float = 0.0
    labor_cost: float = 0.0
    machinery_cost: float = 0.0
    pesticide_cost: float = 0.0
    other_cost: float = 0.0
    selling_price_per_ton: float = 0.0
    expected_yield_ton: float = 0.0

class ReviewCreate(BaseModel):
    status: ReviewStatus
    comments: Optional[str] = None
    recommendation_approved: bool = False
    assumptions_verified: bool = False
