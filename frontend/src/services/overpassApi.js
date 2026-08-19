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
  petrol: "fuel",
  "petrol station": "fuel",
  "petrol stations": "fuel",
};

export async function searchServices(serviceType) {
  const normalizedType =
    SERVICE_TYPES[serviceType] || serviceType;

  const query = `
    [out:json][timeout:25];

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
    headers: {
      "Content-Type": "text/plain",
    },
    body: query,
  });

  if (!response.ok) {
    throw new Error(
      `Overpass API request failed: ${response.status}`
    );
  }

  return response.json();
}