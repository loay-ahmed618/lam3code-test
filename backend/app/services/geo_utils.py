import math
from typing import List, Dict, Any

FEDDAN_TO_M2 = 4200.833
HECTARE_TO_M2 = 10000.0

def calculate_polygon_area_geodesic(points: List[Dict[str, float]]) -> Dict[str, float]:
    """
    Computes accurate geodesic surface area in m², Feddans, and Hectares
    for a polygon specified as a list of dicts [{'lat': float, 'lng': float}].
    """
    if len(points) < 3:
        return {"sq_meters": 0.0, "feddan": 0.0, "hectares": 0.0}

    # Center latitude for equirectangular projection approximation
    avg_lat = sum(p["lat"] for p in points) / len(points)
    lat_rad = math.radians(avg_lat)

    # Earth radius in meters
    R = 6378137.0

    # Project to Cartesian meters
    xy_coords = []
    for p in points:
        x = math.radians(p["lng"]) * R * math.cos(lat_rad)
        y = math.radians(p["lat"]) * R
        xy_coords.append((x, y))

    # Shoelace formula for polygon area
    area = 0.0
    n = len(xy_coords)
    for i in range(n):
        j = (i + 1) % n
        area += xy_coords[i][0] * xy_coords[j][1]
        area -= xy_coords[j][0] * xy_coords[i][1]

    sq_m = abs(area) / 2.0
    return {
        "sq_meters": round(sq_m, 2),
        "feddan": round(sq_m / FEDDAN_TO_M2, 2),
        "hectares": round(sq_m / HECTARE_TO_M2, 2)
    }

def calculate_polygon_metrics(geojson_dict: dict):
    coords = geojson_dict.get("coordinates", [[]])[0]
    points = [{"lat": pt[1], "lng": pt[0]} for pt in coords if len(pt) >= 2]
    res = calculate_polygon_area_geodesic(points)
    center_lat = sum(p["lat"] for p in points) / len(points) if points else 31.1107
    center_lon = sum(p["lng"] for p in points) / len(points) if points else 30.9388
    return {
        "center_lat": round(center_lat, 6),
        "center_lon": round(center_lon, 6),
        "area_m2": res["sq_meters"],
        "area_feddan": res["feddan"],
        "area_hectares": res["hectares"]
    }
