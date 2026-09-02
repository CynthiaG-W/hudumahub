import time
import requests


NOMINATIM_URL = "https://nominatim.openstreetmap.org/search"

HEADERS = {
    "User-Agent": "HudumaHub/1.0 (essential services search application)"
}

SERVICE_CATEGORIES = {
    "hospital": "hospital",
    "pharmacy": "pharmacy",
    "police": "police station",
    "atm": "ATM",
    "fuel": "petrol station"
}


# Simple in-memory cache.
# Results are reused so repeated searches do not repeatedly
# request the same data from Nominatim.
CACHE = {}

# Cache results for 30 minutes.
CACHE_DURATION = 30 * 60

# Keep at least one second between Nominatim requests.
MIN_REQUEST_INTERVAL = 1.1

_last_request_time = 0


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

    global _last_request_time

    cache_key = query.strip().lower()
    current_time = time.time()

    # Return cached results when they are still valid.
    if cache_key in CACHE:
        cached_time, cached_results = CACHE[cache_key]

        if current_time - cached_time < CACHE_DURATION:
            return cached_results

        del CACHE[cache_key]

    # Respect the minimum interval between Nominatim requests.
    elapsed = current_time - _last_request_time

    if elapsed < MIN_REQUEST_INTERVAL:
        time.sleep(MIN_REQUEST_INTERVAL - elapsed)

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

    _last_request_time = time.time()

    if response.status_code == 429:
        raise RuntimeError(
            "Nominatim is temporarily rate-limiting HudumaHub. "
            "Please try again shortly."
        )

    response.raise_for_status()

    results = clean_results(response.json())

    # Store successful results in the cache.
    CACHE[cache_key] = (time.time(), results)

    return results


def search_by_category(category):
    """Search a service category in Nairobi using Nominatim."""

    category = category.lower().strip()

    if category not in SERVICE_CATEGORIES:
        return None

    query = SERVICE_CATEGORIES[category]

    results = search_locations(query)

    # Make sure the frontend receives the selected category
    # instead of the raw OpenStreetMap result type.
    for result in results:
        result["category"] = category

    return results