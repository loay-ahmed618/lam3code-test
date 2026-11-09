from fastapi import APIRouter, Query
from app.services.nasa_power import fetch_nasa_power_data

router = APIRouter(prefix="/api/environmental", tags=["Environmental"])

@router.get("/")
async def get_field_environmental_data(
    lat: float = Query(31.1107, description="Latitude (default: Kafr El-Sheikh)"),
    lon: float = Query(30.9388, description="Longitude (default: Kafr El-Sheikh)"),
    days: int = Query(14, description="Historical lookback window in days")
):
    """
    Retrieves real NASA POWER agro-meteorological data for the field coordinates,
    processes water and heat stress indicators, and attaches mandatory scientific disclosures.
    """
    data = await fetch_nasa_power_data(lat=lat, lon=lon, days=days)
    return data
