import { useState } from "react";

import {
  searchLocations,
  searchServicesByCategory,
} from "./services/nominatimApi";

import ServiceCard from "./components/ServiceCard";
import MapView from "./components/MapView";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";

import "./App.css";

const API_BASE_URL = "http://127.0.0.1:5000/api";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Authentication state
  const [authPage, setAuthPage] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("hudumahub_user");

    return storedUser ? JSON.parse(storedUser) : null;
  });

  const resultsPerPage = 10;

  // -----------------------------
  // Search
  // -----------------------------

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setError("");
      setMessage("Please enter a service to search for.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");
    setSelectedService(null);

    try {
      const results = await searchLocations(searchTerm.trim());

      setServices(results);
      setCurrentPage(1);

      if (results.length === 0) {
        setMessage(`No results found for "${searchTerm}".`);
      } else {
        setMessage(
          `Found ${results.length} services for "${searchTerm}".`
        );
      }
    } catch (error) {
      console.error("Search error:", error);

      setServices([]);

      setError(
        "Unable to search for services. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Category search
  // -----------------------------

  const handleCategorySearch = async (category) => {
    setLoading(true);
    setError("");
    setMessage("");
    setSelectedService(null);

    try {
      const results = await searchServicesByCategory(category);

      setServices(results);
      setCurrentPage(1);

      if (results.length === 0) {
        setMessage(`No ${category} services found.`);
      } else {
        setMessage(
          `Found ${results.length} ${category} services in Nairobi.`
        );
      }
    } catch (error) {
      console.error("Category search error:", error);

      setServices([]);

      setError(
        "We couldn't find that service. Try searching for a hospital, pharmacy, ATM, police station, or petrol station."
      );
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Login
  // -----------------------------

  const handleLogin = async (event) => {
    event.preventDefault();

    setAuthLoading(true);
    setAuthError("");

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      localStorage.setItem(
        "hudumahub_token",
        data.access_token
      );

      localStorage.setItem(
        "hudumahub_user",
        JSON.stringify(data.user)
      );

      setUser(data.user);

      setUsername("");
      setEmail("");
      setPassword("");

      setAuthError("");
      setAuthPage(null);
    } catch (error) {
      console.error("Login error:", error);

      setAuthError(error.message);
    } finally {
      setAuthLoading(false);
    }
  };

  // -----------------------------
  // Register
  // -----------------------------

  const handleRegister = async (event) => {
    event.preventDefault();

    setAuthLoading(true);
    setAuthError("");

    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Registration failed"
        );
      }

      setUsername("");
      setEmail("");
      setPassword("");

      setAuthError("");
      setAuthPage("login");
    } catch (error) {
      console.error("Registration error:", error);

      setAuthError(error.message);
    } finally {
      setAuthLoading(false);
    }
  };

  // -----------------------------
  // Logout
  // -----------------------------

  const handleLogout = () => {
    localStorage.removeItem("hudumahub_token");
    localStorage.removeItem("hudumahub_user");

    setUser(null);
  };

  // -----------------------------
  // Pagination
  // -----------------------------

  const totalPages = Math.ceil(
    services.length / resultsPerPage
  );

  const startIndex =
    (currentPage - 1) * resultsPerPage;

  const currentServices = services.slice(
    startIndex,
    startIndex + resultsPerPage
  );

  // -----------------------------
  // Login page
  // -----------------------------

  if (authPage === "login") {
    return (
      <div className="app">
        <nav className="navbar">
          <div className="brand">
            <div className="brand-icon">
              📍
            </div>

            <div className="brand-text">
              <span className="brand-name">
                HudumaHub
              </span>

              <span className="brand-tagline">
                Essential services, nearby.
              </span>
            </div>
          </div>

          <div className="nav-links">
            <button
              type="button"
              onClick={() => {
                setAuthPage(null);
                setAuthError("");
              }}
            >
              Back to Home
            </button>
          </div>
        </nav>

        <Login
          email={email}
          password={password}
          setEmail={setEmail}
          setPassword={setPassword}
          onLogin={handleLogin}
          onSwitchToRegister={() => {
            setAuthPage("register");
            setAuthError("");
          }}
          loading={authLoading}
          error={authError}
        />
      </div>
    );
  }

  // -----------------------------
  // Register page
  // -----------------------------

  if (authPage === "register") {
    return (
      <div className="app">
        <nav className="navbar">
          <div className="brand">
            <div className="brand-icon">
              📍
            </div>

            <div className="brand-text">
              <span className="brand-name">
                HudumaHub
              </span>

              <span className="brand-tagline">
                Essential services, nearby.
              </span>
            </div>
          </div>

          <div className="nav-links">
            <button
              type="button"
              onClick={() => {
                setAuthPage(null);
                setAuthError("");
              }}
            >
              Back to Home
            </button>
          </div>
        </nav>

        <Register
          username={username}
          email={email}
          password={password}
          setUsername={setUsername}
          setEmail={setEmail}
          setPassword={setPassword}
          onRegister={handleRegister}
          onSwitchToLogin={() => {
            setAuthPage("login");
            setAuthError("");
          }}
          loading={authLoading}
          error={authError}
        />
      </div>
    );
  }

  // -----------------------------
  // Main application
  // -----------------------------

  return (
    <div className="app">

      {/* Navbar */}
      <nav className="navbar">
        <div className="brand">
          <div className="brand-icon">
            📍
          </div>

          <div className="brand-text">
            <span className="brand-name">
              HudumaHub
            </span>

            <span className="brand-tagline">
              Essential services, nearby.
            </span>
          </div>
        </div>

        <div className="nav-links">
          <a href="#home">
            Home
          </a>

          <a href="#services">
            Services
          </a>

          {user ? (
            <>
              <span>
                Hi, {user.username}
              </span>

              <button
                type="button"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => {
                setAuthPage("login");
                setAuthError("");
              }}
            >
              Login
            </button>
          )}
        </div>
      </nav>

      <main>

        {/* Hero Section */}
        <section
          className="hero"
          id="home"
        >
          <div className="hero-content">

            <div className="hero-badge">
              📍 Nairobi Service Finder
            </div>

            <h1>
              Find essential services
              <span>
                {" "}
                around Nairobi
              </span>
            </h1>

            <p>
              Quickly discover hospitals,
              pharmacies, ATMs, police stations,
              petrol stations, and other
              essential services near you.
            </p>

            {/* Search */}
            <div className="search-container">
              <span className="search-icon">
                🔎
              </span>

              <input
                type="text"
                placeholder="What service are you looking for?"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(
                    event.target.value
                  )
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleSearch();
                  }
                }}
              />

              <button
                onClick={handleSearch}
                disabled={loading}
              >
                {loading
                  ? "Searching..."
                  : "Search"}
              </button>
            </div>

            {/* Status messages */}
            {loading && (
              <div className="status-message loading-message">
                <span>⏳</span>
                Finding services in Nairobi...
              </div>
            )}

            {!loading &&
              message &&
              !error && (
                <div className="status-message success-message">
                  <span>✓</span>
                  {message}
                </div>
              )}

            {error && (
              <div className="status-message error-message">
                <span>!</span>
                {error}
              </div>
            )}

          </div>
        </section>

        {/* Results Section */}
        {services.length > 0 && (
          <section className="results-section">

            <div className="section-heading">
              <div>
                <span className="section-label">
                  SEARCH RESULTS
                </span>

                <h2>
                  Services in Nairobi
                </h2>
              </div>

              <span className="result-count">
                {services.length} found
              </span>
            </div>

            {/* Map */}
            <div className="map-wrapper">
              <MapView
                services={services}
                selectedService={selectedService}
              />
            </div>

            {/* Service Cards */}
            <div className="service-results">
              {currentServices.map((service) => (
                <ServiceCard
                  key={`${service.type}-${service.id}`}
                  service={service}
                  onViewMap={setSelectedService}
                  user={user}
                />
              ))}
            </div>

            {/* Pagination */}
            {services.length > resultsPerPage && (
              <div className="pagination">

                <button
                  onClick={() =>
                    setCurrentPage(
                      (page) => page - 1
                    )
                  }
                  disabled={
                    currentPage === 1
                  }
                >
                  ← Previous
                </button>

                <span>
                  Page {currentPage} of{" "}
                  {totalPages}
                </span>

                <button
                  onClick={() =>
                    setCurrentPage(
                      (page) => page + 1
                    )
                  }
                  disabled={
                    currentPage === totalPages
                  }
                >
                  Next →
                </button>

              </div>
            )}

          </section>
        )}

        {/* Popular Services */}
        <section
          className="services"
          id="services"
        >
          <div className="section-heading centered">

            <div>
              <span className="section-label">
                EXPLORE
              </span>

              <h2>
                Popular Services
              </h2>

              <p>
                Select a category to quickly
                find services across Nairobi.
              </p>
            </div>

          </div>

          <div className="service-categories">

            <button
              onClick={() =>
                handleCategorySearch("hospital")
              }
              disabled={loading}
            >
              <span>🏥</span>

              <div>
                <strong>
                  Hospitals
                </strong>

                <small>
                  Medical care
                </small>
              </div>
            </button>

            <button
              onClick={() =>
                handleCategorySearch("pharmacy")
              }
              disabled={loading}
            >
              <span>💊</span>

              <div>
                <strong>
                  Pharmacies
                </strong>

                <small>
                  Medicine & health
                </small>
              </div>
            </button>

            <button
              onClick={() =>
                handleCategorySearch("atm")
              }
              disabled={loading}
            >
              <span>🏧</span>

              <div>
                <strong>
                  ATMs
                </strong>

                <small>
                  Banking services
                </small>
              </div>
            </button>

            <button
              onClick={() =>
                handleCategorySearch("police")
              }
              disabled={loading}
            >
              <span>🚔</span>

              <div>
                <strong>
                  Police Stations
                </strong>

                <small>
                  Safety & security
                </small>
              </div>
            </button>

            <button
              onClick={() =>
                handleCategorySearch(
                  "petrol station"
                )
              }
              disabled={loading}
            >
              <span>⛽</span>

              <div>
                <strong>
                  Petrol Stations
                </strong>

                <small>
                  Fuel & services
                </small>
              </div>
            </button>

          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="footer">

        <div className="footer-brand">

          <div className="brand-icon small">
            📍
          </div>

          <strong>
            HudumaHub
          </strong>

        </div>

        <p>
          Helping Nairobi residents find
          essential services quickly and
          easily.
        </p>

        <span>
          © 2026 HudumaHub
        </span>

      </footer>

    </div>
  );
}

export default App;