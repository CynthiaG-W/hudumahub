const OVERPASS_URL = "https://overpass-api.de/api/interpreter";

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
  "petrol station": "fuel",
  "petrol stations": "fuel",
  petrol: "fuel",
};

export async function searchServices(serviceType) {
  const normalizedType = SERVICE_TYPES[serviceType] || serviceType;

  const query = `
    [out:json];
    area["name"="Nairobi"]["boundary"="administrative"]->.searchArea;
    (
      node["amenity"="${normalizedType}"](area.searchArea);
      way["amenity"="${normalizedType}"](area.searchArea);
      relation["amenity"="${normalizedType}"](area.searchArea);
    );
    out center;
  `;

  const response = await fetch(OVERPASS_URL, {
    method: "POST",
    body: query,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch services");
  }

  return response.json();
}