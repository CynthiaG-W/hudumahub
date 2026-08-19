import { useState } from "react";
import { searchServices } from "./services/overpassApi";
import ServiceCard from "./components/ServiceCard";
import "./App.css";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (searchTerm.trim() === "") {
      setMessage("Please enter a service to search for.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const data = await searchServices(
        searchTerm.trim().toLowerCase()
      );

      setServices(data.elements);

      setMessage(
        `Found ${data.elements.length} results for ${searchTerm}.`
      );
    } catch (error) {
      console.error("API error:", error);
      setError("Something went wrong. Please try again.");
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySearch = async (serviceType) => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const data = await searchServices(serviceType);

      setServices(data.elements);

      setMessage(`Found ${data.elements.length} services.`);
    } catch (error) {
      console.error("API error:", error);
      setError("Something went wrong. Please try again.");
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <nav className="navbar">
        <div className="logo">HudumaHub</div>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#services">Services</a>
          <a href="#about">About</a>
        </div>
      </nav>

      <main>
        <section className="hero" id="home">
          <h1>Find Essential Services in Nairobi</h1>

          <p>
            Discover hospitals, pharmacies, ATMs, police stations,
            and other essential services across Nairobi.
          </p>

          <div className="search-container">
            <input
              type="text"
              placeholder="What service are you looking for?"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />

            <button onClick={handleSearch} disabled={loading}>
              {loading ? "Searching..." : "Search"}
            </button>
          </div>

          {loading && (
            <p className="search-message">
              ⏳ Finding services...
            </p>
          )}

          {error && (
            <p className="error-message">
              ❌ {error}
            </p>
          )}

          {!loading && !error && message && (
            <p className="search-message">
              {message}
            </p>
          )}

          <div className="service-results">
            {services.slice(0, 10).map((service) => (
              <ServiceCard
                key={`${service.type}-${service.id}`}
                service={service}
              />
            ))}
          </div>
        </section>

        <section className="services" id="services">
          <h2>Popular Services</h2>

          <div className="service-categories">
            <button
              onClick={() => handleCategorySearch("hospital")}
              disabled={loading}
            >
              🏥 Hospitals
            </button>

            <button
              onClick={() => handleCategorySearch("pharmacy")}
              disabled={loading}
            >
              💊 Pharmacies
            </button>

            <button
              onClick={() => handleCategorySearch("atm")}
              disabled={loading}
            >
              🏧 ATMs
            </button>

            <button
              onClick={() => handleCategorySearch("police")}
              disabled={loading}
            >
              🚔 Police Stations
            </button>

            <button
              onClick={() => handleCategorySearch("petrol station")}
              disabled={loading}
            >
              ⛽ Petrol Stations
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;