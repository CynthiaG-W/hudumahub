import { useEffect, useState } from "react";
import {
  searchLocations,
  searchServicesByCategory,
} from "../services/nominatimApi";

import ServiceCard from "../components/ServiceCard";
import MapView from "../components/MapView";

function Home({
  user,
  onAddToHub,
  savedServiceIds,
  getServiceKey,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const RESULTS_PER_PAGE = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [services]);

  const totalPages = Math.ceil(
    services.length / RESULTS_PER_PAGE
  );

  const startIndex =
    (currentPage - 1) * RESULTS_PER_PAGE;

  const currentServices = services.slice(
    startIndex,
    startIndex + RESULTS_PER_PAGE
  );

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setMessage(
        "Please enter a service or place to search for."
      );
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");
    setSelectedService(null);

    try {
      const results = await searchLocations(
        searchTerm.trim()
      );

      setServices(results);

      setMessage(
        results.length
          ? `Found ${results.length} places matching "${searchTerm}".`
          : `No places found for "${searchTerm}".`
      );
    } catch (error) {
      console.error("Search error:", error);
      setServices([]);
      setError(
        "We couldn't complete your search. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySearch = async (category) => {
    setLoading(true);
    setError("");
    setMessage("");
    setSelectedService(null);

    try {
      const results = await searchServicesByCategory(
        category
      );

      setServices(results);

      setMessage(
        results.length
          ? `Showing ${results.length} ${category} services in Nairobi.`
          : `No ${category} services found.`
      );
    } catch (error) {
      console.error("Category search error:", error);
      setServices([]);
      setError(
        "We couldn't load those services. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handleSelectService = (service) => {
    setSelectedService(service);

    setTimeout(() => {
      document
        .getElementById("services-map")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
    }, 100);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSelectedService(null);

    window.scrollTo({
      top:
        document.querySelector(".results-section")
          ?.offsetTop - 80,
      behavior: "smooth",
    });
  };

  const categories = [
    { id: "hospital", label: "Hospitals", icon: "🏥" },
    { id: "pharmacy", label: "Pharmacies", icon: "💊" },
    { id: "atm", label: "ATMs", icon: "🏧" },
    { id: "police", label: "Police", icon: "👮🏽" },
    { id: "fuel", label: "Fuel", icon: "⛽" },
  ];

  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">
            ✦ Find essential services in Nairobi
          </div>

          <h1>
            Find what you need,{" "}
            <span>when you need it.</span>
          </h1>

          <p>
            Search for essential services around Nairobi
            and keep the places that matter to you in one
            personal hub.
          </p>

          <div className="search-container">
            <span className="search-icon">⌕</span>

            <input
              type="text"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              onKeyDown={handleKeyDown}
              placeholder="Search for a hospital, pharmacy, ATM..."
              aria-label="Search for a service"
            />

            <button
              onClick={handleSearch}
              disabled={loading}
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>

          <div className="category-list">
            {categories.map((category) => (
              <button
                key={category.id}
                className="category-button"
                onClick={() =>
                  handleCategorySearch(category.id)
                }
                disabled={loading}
              >
                <span>{category.icon}</span>
                {category.label}
              </button>
            ))}
          </div>

          {message && (
            <p className="status-message success-message">
              {message}
            </p>
          )}

          {error && (
            <p className="status-message error-message">
              {error}
            </p>
          )}
        </div>
      </section>

      {services.length > 0 && (
        <section className="results-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">DISCOVER</span>
              <h2>Places around Nairobi</h2>
              <p>
                Explore essential services and save the ones
                that matter to you.
              </p>
            </div>

            <span className="results-count">
              {services.length} results
            </span>
          </div>

          <div
            className="map-wrapper"
            id="services-map"
          >
            <MapView
              services={currentServices}
              selectedService={selectedService}
              onSelectService={setSelectedService}
            />
          </div>

          <div className="service-results-grid">
            {currentServices.map((service, index) => (
              <ServiceCard
                key={
                  service.osm_type && service.osm_id
                    ? `${service.osm_type}-${service.osm_id}`
                    : `${service.name}-${service.latitude}-${service.longitude}-${index}`
                }
                service={service}
                isSelected={selectedService === service}
                onSelect={() =>
                  handleSelectService(service)
                }
                user={user}
                onAddToHub={onAddToHub}
                isSaved={savedServiceIds?.has(
                  getServiceKey(service)
                )}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() =>
                  handlePageChange(currentPage - 1)
                }
                disabled={currentPage === 1}
              >
                ← Previous
              </button>

              <span>
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() =>
                  handlePageChange(currentPage + 1)
                }
                disabled={currentPage === totalPages}
              >
                Next →
              </button>
            </div>
          )}
        </section>
      )}
    </>
  );
}

export default Home;