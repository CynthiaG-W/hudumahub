import requests


NOMINATIM_URL = "https://nominatim.openstreetmap.org/search"

HEADERS = {
    "User-Agent": "HudumaHub/1.0"
}

SERVICE_CATEGORIES = {
    "hospital": "hospital",
    "pharmacy": "pharmacy",
    "police": "police station",
    "atm": "ATM",
    "fuel": "petrol station"
}


def clean_results(results, category=None):
    """Format Nominatim results for the HudumaHub frontend."""

    cleaned_results = []

    for result in results:
        cleaned_results.append({
            "name": result.get("name") or result.get("display_name"),
            "category": category or result.get("type", "service"),
            "address": result.get("display_name"),
            "latitude": float(result["lat"]),
            "longitude": float(result["lon"]),
            "osm_id": result.get("osm_id"),
            "osm_type": result.get("osm_type")
        })

    return cleaned_results


def search_locations(query):
    """Search for a place or service in Nairobi."""

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
        timeout=15
    )

    response.raise_for_status()

    return clean_results(response.json())


def search_by_category(category):
    """Search a service category in Nairobi using Nominatim."""

    category = category.lower().strip()

    if category not in SERVICE_CATEGORIES:
        return None

    # Use the same search approach as a user's normal search
    query = SERVICE_CATEGORIES[category]

    return search_locations(query)