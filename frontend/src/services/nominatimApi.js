const API_URL = "http://127.0.0.1:5000";

export const SERVICE_TYPES = {
  hospital: "hospital",
  hospitals: "hospital",
  pharmacy: "pharmacy",
  pharmacies: "pharmacy",
  police: "police",
  "police station": "police",
  "police stations": "police",
  atm: "atm",
  atms: "atm",
  petrol: "fuel",
  "petrol station": "fuel",
  "petrol stations": "fuel",
};

export async function searchServices(serviceType) {
  const normalizedType =
    SERVICE_TYPES[serviceType.toLowerCase()] || serviceType.toLowerCase();

  const response = await fetch(
    `${API_URL}/api/services/search?category=${encodeURIComponent(
      normalizedType
    )}`
  );

  if (!response.ok) {
    throw new Error(
      `HudumaHub API request failed: ${response.status}`
    );
  }

  const data = await response.json();

  return {
    elements: data.results.map((place) => ({
      type: place.osm_type,
      id: place.osm_id,
      lat: place.latitude,
      lon: place.longitude,
      center: {
        lat: place.latitude,
        lon: place.longitude,
      },
      tags: {
        name: place.name || "Unnamed service",
        amenity: place.category,
        address: place.address,
      },
    })),
  };
}