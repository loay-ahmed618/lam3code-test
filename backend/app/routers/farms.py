from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.database import get_db
from app.models.entities import Farm, Field, User
from app.services.geo_utils import calculate_polygon_area_geodesic

router = APIRouter(prefix="/api/farms", tags=["Farms"])

def ensure_default_user_and_farm(db: Session) -> Farm:
    user = db.query(User).first()
    if not user:
        user = User(
            email="farmer@soldoc.eg",
            hashed_password="mock_hashed_pw",
            full_name="Mahmoud El-Sayed"
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    farm = db.query(Farm).first()
    if not farm:
        farm = Farm(
            name="Nile Delta Master Farm",
            country="Egypt",
            region="Kafr El-Sheikh",
            description="Family agricultural land in Kafr El-Sheikh, Desouk center.",
            owner_id=user.id
        )
        db.add(farm)
        db.commit()
        db.refresh(farm)
    return farm

@router.get("/")
def list_farms(db: Session = Depends(get_db)):
    ensure_default_user_and_farm(db)
    farms = db.query(Farm).all()
    res = []
    for f in farms:
        fields = db.query(Field).filter(Field.farm_id == f.id).all()
        res.append({
            "id": f.id,
            "name": f.name,
            "country": f.country,
            "region": f.region,
            "field_count": len(fields)
        })
    return res

@router.get("/{farm_id}/fields")
def get_farm_fields(farm_id: int, db: Session = Depends(get_db)):
    farm = ensure_default_user_and_farm(db)
    fields = db.query(Field).filter(Field.farm_id == farm.id).all()
    if not fields:
        # Seed an initial field if empty
        default_poly = [
            {"lat": 31.1125, "lng": 30.9355},
            {"lat": 31.1142, "lng": 30.9421},
            {"lat": 31.1088, "lng": 30.9442},
            {"lat": 31.1072, "lng": 30.9372}
        ]
        calc = calculate_polygon_area_geodesic(default_poly)
        f_init = Field(
            farm_id=farm.id,
            name="Field Delta-01 (Hawd El-Raml)",
            crop_type="Wheat (Giza 171)",
            season="Winter 2024/2025",
            planting_date="2024-11-15",
            irrigation_system="Surface / Furrow Flood",
            soil_type="Clay Loam (طميية ثقيلة)",
            polygon_geojson=default_poly,
            center_lat=31.1107,
            center_lon=30.9388,
            area_m2=calc["sq_meters"],
            area_feddan=calc["feddan"],
            area_hectares=calc["hectares"]
        )
        db.add(f_init)
        db.commit()
        db.refresh(f_init)
        fields = [f_init]

    results = []
    for f in fields:
        results.append({
            "id": f.id,
            "farm_id": f.farm_id,
            "name": f.name,
            "crop_type": f.crop_type,
            "season": f.season,
            "planting_date": f.planting_date,
            "irrigation_system": f.irrigation_system,
            "soil_type": f.soil_type,
            "area_feddan": f.area_feddan,
            "area_hectares": f.area_hectares,
            "area_m2": f.area_m2,
            "center_lat": f.center_lat,
            "center_lon": f.center_lon,
            "polygon_geojson": f.polygon_geojson
        })
    return results

@router.post("/{farm_id}/fields")
def save_field(farm_id: int, payload: Dict[str, Any], db: Session = Depends(get_db)):
    farm = ensure_default_user_and_farm(db)
    coords = payload.get("polygon_coordinates", [])
    if coords:
        calc = calculate_polygon_area_geodesic(coords)
    else:
        calc = {"feddan": 12.4, "hectares": 5.21, "sq_meters": 52080.0}

    center_lat = float(payload.get("center_lat", coords[0]["lat"] if coords else 31.1107))
    center_lon = float(payload.get("center_lon", coords[0]["lng"] if coords else 30.9388))

    field = Field(
        farm_id=farm.id,
        name=payload.get("name", "Field Delta-01"),
        crop_type=payload.get("crop_type", "Wheat (Giza 171)"),
        season=payload.get("season", "Winter 2024/2025"),
        planting_date=payload.get("planting_date", "2024-11-15"),
        irrigation_system=payload.get("irrigation_system", "Surface Flood"),
        soil_type=payload.get("soil_type", "Clay Loam"),
        polygon_geojson=coords,
        center_lat=center_lat,
        center_lon=center_lon,
        area_m2=calc["sq_meters"],
        area_feddan=calc["feddan"],
        area_hectares=calc["hectares"]
    )
    db.add(field)
    db.commit()
    db.refresh(field)

    return {
        "id": field.id,
        "farm_id": field.farm_id,
        "name": field.name,
        "crop_type": field.crop_type,
        "season": field.season,
        "area_feddan": field.area_feddan,
        "area_hectares": field.area_hectares,
        "area_m2": field.area_m2,
        "polygon_geojson": field.polygon_geojson
    }
