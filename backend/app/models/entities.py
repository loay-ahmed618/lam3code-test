import datetime
import enum
from sqlalchemy import Column, Integer, String, Float, Text, Boolean, DateTime, ForeignKey, Enum as SQLEnum, JSON
from sqlalchemy.orm import relationship
from app.database import Base

class UserRole(str, enum.Enum):
    FARMER = "farmer"
    AGRONOMIST = "agronomist"
    ADMIN = "admin"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(SQLEnum(UserRole), default=UserRole.FARMER, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    farms = relationship("Farm", back_populates="owner", cascade="all, delete-orphan")
    reviews = relationship("AgronomistReview", back_populates="agronomist")

class Farm(Base):
    __tablename__ = "farms"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    country = Column(String(100), default="Egypt", nullable=False)
    region = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    owner = relationship("User", back_populates="farms")
    fields = relationship("Field", back_populates="farm", cascade="all, delete-orphan")

class Field(Base):
    __tablename__ = "fields"
    id = Column(Integer, primary_key=True, index=True)
    farm_id = Column(Integer, ForeignKey("farms.id"), nullable=False)
    name = Column(String(255), nullable=False)
    crop_type = Column(String(100), nullable=False)
    season = Column(String(50), nullable=False)
    planting_date = Column(String(50), nullable=True)
    irrigation_system = Column(String(100), default="Surface / Flood")
    soil_type = Column(String(100), default="Clay Loam")
    polygon_geojson = Column(JSON, nullable=False)
    center_lat = Column(Float, nullable=False)
    center_lon = Column(Float, nullable=False)
    area_m2 = Column(Float, nullable=False)
    area_feddan = Column(Float, nullable=False)
    area_hectares = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    farm = relationship("Farm", back_populates="fields")
    goal_profile = relationship("GoalProfile", back_populates="field", uselist=False, cascade="all, delete-orphan")
    strategies = relationship("FieldStrategy", back_populates="field", cascade="all, delete-orphan")
    simulations = relationship("SimulationScenario", back_populates="field", cascade="all, delete-orphan")
    financials = relationship("FinancialRecord", back_populates="field", uselist=False, cascade="all, delete-orphan")
    reviews = relationship("AgronomistReview", back_populates="field", cascade="all, delete-orphan")
    reports = relationship("FieldReport", back_populates="field", cascade="all, delete-orphan")

class GoalProfile(Base):
    __tablename__ = "goal_profiles"
    id = Column(Integer, primary_key=True, index=True)
    field_id = Column(Integer, ForeignKey("fields.id"), unique=True, nullable=False)
    weight_yield = Column(Float, default=0.0)
    weight_water = Column(Float, default=0.0)
    weight_soil = Column(Float, default=0.0)
    weight_profit = Column(Float, default=0.0)
    weight_climate = Column(Float, default=0.0)
    weight_inputs = Column(Float, default=0.0)
    water_quota_m3_per_feddan = Column(Float, nullable=True)
    is_water_quota_hard = Column(Boolean, default=True)
    max_budget_egp_per_feddan = Column(Float, nullable=True)
    is_budget_hard = Column(Boolean, default=True)
    available_labor_hours = Column(Float, nullable=True)
    equipment_restrictions = Column(String(255), nullable=True)
    farmer_notes = Column(Text, nullable=True)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    field = relationship("Field", back_populates="goal_profile")

class FieldStrategy(Base):
    __tablename__ = "field_strategies"
    id = Column(Integer, primary_key=True, index=True)
    field_id = Column(Integer, ForeignKey("fields.id"), nullable=False)
    strategy_code = Column(String(50), nullable=False)
    name_en = Column(String(255), nullable=False)
    name_ar = Column(String(255), nullable=False)
    description_en = Column(Text, nullable=False)
    description_ar = Column(Text, nullable=False)
    is_feasible = Column(Boolean, default=True)
    violated_constraints = Column(JSON, default=list)
    expected_yield_ton_per_feddan = Column(Float, nullable=False)
    water_use_m3_per_feddan = Column(Float, nullable=False)
    soil_health_index = Column(Float, nullable=False)
    production_cost_egp_per_feddan = Column(Float, nullable=False)
    expected_net_profit_egp = Column(Float, nullable=False)
    climate_risk_score = Column(Float, nullable=False)
    input_dependency_score = Column(Float, nullable=False)
    norm_yield = Column(Float, nullable=False)
    norm_water = Column(Float, nullable=False)
    norm_soil = Column(Float, nullable=False)
    norm_profit = Column(Float, nullable=False)
    norm_climate = Column(Float, nullable=False)
    norm_inputs = Column(Float, nullable=False)
    final_score = Column(Float, nullable=False)
    rank = Column(Integer, default=1)
    explanation_en = Column(Text, nullable=False)
    explanation_ar = Column(Text, nullable=False)
    assumptions_en = Column(JSON, default=list)
    assumptions_ar = Column(JSON, default=list)
    tradeoffs_en = Column(JSON, default=list)
    tradeoffs_ar = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    field = relationship("Field", back_populates="strategies")

class SimulationScenario(Base):
    __tablename__ = "simulation_scenarios"
    id = Column(Integer, primary_key=True, index=True)
    field_id = Column(Integer, ForeignKey("fields.id"), nullable=False)
    scenario_type = Column(String(50), nullable=False)
    name_en = Column(String(255), nullable=False)
    name_ar = Column(String(255), nullable=False)
    temp_anomaly_c = Column(Float, default=0.0)
    water_reduction_pct = Column(Float, default=0.0)
    cost_increase_pct = Column(Float, default=0.0)
    price_change_pct = Column(Float, default=0.0)
    impact_yield_pct = Column(Float, default=0.0)
    impact_profit_pct = Column(Float, default=0.0)
    impact_water_stress_pct = Column(Float, default=0.0)
    details_en = Column(Text, nullable=True)
    details_ar = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    field = relationship("Field", back_populates="simulations")

class FinancialRecord(Base):
    __tablename__ = "financial_records"
    id = Column(Integer, primary_key=True, index=True)
    field_id = Column(Integer, ForeignKey("fields.id"), unique=True, nullable=False)
    currency = Column(String(10), default="EGP")
    seed_cost = Column(Float, default=0.0)
    fertilizer_cost = Column(Float, default=0.0)
    irrigation_cost = Column(Float, default=0.0)
    labor_cost = Column(Float, default=0.0)
    machinery_cost = Column(Float, default=0.0)
    pesticide_cost = Column(Float, default=0.0)
    other_cost = Column(Float, default=0.0)
    selling_price_per_ton = Column(Float, default=0.0)
    expected_yield_ton = Column(Float, default=0.0)
    total_cost = Column(Float, default=0.0)
    gross_revenue = Column(Float, default=0.0)
    net_profit = Column(Float, default=0.0)
    breakeven_price = Column(Float, default=0.0)
    breakeven_yield = Column(Float, default=0.0)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    field = relationship("Field", back_populates="financials")

class ReviewStatus(str, enum.Enum):
    PENDING = "pending"
    REVIEWED = "reviewed"
    APPROVED = "approved"
    CHANGES_REQUESTED = "changes_requested"
    REJECTED = "rejected"

class AgronomistReview(Base):
    __tablename__ = "agronomist_reviews"
    id = Column(Integer, primary_key=True, index=True)
    field_id = Column(Integer, ForeignKey("fields.id"), nullable=False)
    agronomist_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    status = Column(SQLEnum(ReviewStatus), default=ReviewStatus.PENDING, nullable=False)
    comments = Column(Text, nullable=True)
    recommendation_approved = Column(Boolean, default=False)
    assumptions_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    field = relationship("Field", back_populates="reviews")
    agronomist = relationship("User", back_populates="reviews")

class FieldReport(Base):
    __tablename__ = "field_reports"
    id = Column(Integer, primary_key=True, index=True)
    field_id = Column(Integer, ForeignKey("fields.id"), nullable=False)
    title = Column(String(255), nullable=False)
    language = Column(String(10), default="ar")
    summary_data = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    field = relationship("Field", back_populates="reports")
