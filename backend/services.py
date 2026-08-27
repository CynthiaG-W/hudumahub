import requests

from extensions import db
from models import Service


NOMINATIM_URL = "https://nominatim.openstreetmap.org/search"

HEADERS = {
    "User-Agent": "HudumaHub/1.0"
}

SERVICE_CATEGORIES = {
    "hospital": "hospitals in Nairobi",
    "pharmacy": "pharmacies in Nairobi",
    "police": "police station Nairobi",
    "atm": "ATMs in Nairobi",
    "fuel": "petrol station Nairobi"
}


def search_locations(query):
    params = {
        "q": f"{query}, Nairobi, Kenya",
        "format": "jsonv2",
        "limit": 40,
        "addressdetails": 1,
        "countrycodes": "ke"
    }

    response = requests.get(
        NOMINATIM_URL,
        params=params,
        headers=HEADERS,
        timeout=10
    )

    response.raise_for_status()

    results = response.json()

    cleaned_results = []

    for result in results:
        cleaned_results.append({
            "name": result.get("name") or result.get("display_name"),
            "category": result.get("type"),
            "address": result.get("display_name"),
            "latitude": float(result["lat"]),
            "longitude": float(result["lon"]),
            "osm_id": result.get("osm_id"),
            "osm_type": result.get("osm_type")
        })

    return cleaned_results


def search_by_category(category):
    category = category.lower().strip()

    if category not in SERVICE_CATEGORIES:
        return None

    services = Service.query.filter_by(
        category=category
    ).all()

    return [service.to_dict() for service in services]