const NOMINATIM_URL =
  "https://nominatim.openstreetmap.org/search";

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
    SERVICE_TYPES[serviceType] || serviceType;

  const query = `${normalizedType} in Nairobi`;

  const response = await fetch(
    `${NOMINATIM_URL}?format=jsonv2&q=${encodeURIComponent(
      query
    )}&limit=50`
  );

  if (!response.ok) {
    throw new Error(
      `Nominatim API request failed: ${response.status}`
    );
  }

  const data = await response.json();

  return {
    elements: data.map((place) => ({
      type: place.osm_type,
      id: place.osm_id,
      lat: parseFloat(place.lat),
      lon: parseFloat(place.lon),
      center: {
        lat: parseFloat(place.lat),
        lon: parseFloat(place.lon),
      },
      tags: {
        name: place.name || "Unnamed service",
        amenity: place.type,
        address: place.display_name,
      },
    })),
  };
}