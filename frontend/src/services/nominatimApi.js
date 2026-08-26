const API_BASE_URL = "http://127.0.0.1:5000/api";

export async function searchLocations(query) {
  const response = await fetch(
    `${API_BASE_URL}/search?q=${encodeURIComponent(query)}`
  );

  if (!response.ok) {
    throw new Error("Location search failed");
  }

  const data = await response.json();

  return data.results;
}

export async function searchServicesByCategory(category) {
  const response = await fetch(
    `${API_BASE_URL}/services/search?category=${encodeURIComponent(category)}`
  );

  if (!response.ok) {
    throw new Error("Service search failed");
  }

  const data = await response.json();

  return data.results;
}