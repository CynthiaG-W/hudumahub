import { useEffect, useState } from "react";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import MyHub from "./pages/MyHub";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";

import "./App.css";

const API_BASE_URL = "http://127.0.0.1:5000/api";

// ========================================
// Create a consistent unique key for a service
// ========================================
const getServiceKey = (service) => {
  if (service?.osm_type && service?.osm_id) {
    return `${service.osm_type}-${service.osm_id}`;
  }

  // Fallback for services without OSM information
  return `${service?.name || "unknown"}-${service?.latitude || ""}-${
    service?.longitude || ""
  }`
    .toLowerCase()
    .trim();
};

function App() {
  // =========================
  // Navigation & Authentication
  // =========================

  const [page, setPage] = useState("home");

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("hudumahub_user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // =========================
  // My Hub State
  // =========================

  const [savedServices, setSavedServices] = useState([]);
  const [savedLoading, setSavedLoading] = useState(false);
  const [savedError, setSavedError] = useState("");
  const [savedMessage, setSavedMessage] = useState("");

  const getToken = () => localStorage.getItem("hudumahub_token");

  // =========================
  // Logout
  // =========================

  const handleLogout = () => {
    localStorage.removeItem("hudumahub_token");
    localStorage.removeItem("hudumahub_user");

    setUser(null);
    setSavedServices([]);
    setSavedError("");
    setSavedMessage("");
    setPage("home");
  };

  // =========================
  // Fetch My Hub
  // =========================

  const fetchSavedServices = async () => {
    const token = getToken();

    if (!token) {
      setSavedServices([]);
      return;
    }

    try {
      setSavedLoading(true);
      setSavedError("");

      const response = await fetch(
        `${API_BASE_URL}/saved-services?per_page=100`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        handleLogout();
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.error || data.msg || "Unable to load your Hub."
        );
      }

      setSavedServices(data.saved_services || []);
    } catch (error) {
      console.error("Error loading My Hub:", error);
      setSavedError(error.message || "Unable to load your Hub.");
    } finally {
      setSavedLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchSavedServices();
    }
  }, [user]);

  // =========================
  // Add Place to My Hub
  // =========================

  const handleAddToHub = async (service) => {
    const token = getToken();

    if (!user || !token) {
      setPage("login");
      return;
    }

    // Prevent duplicates on the frontend
    const serviceKey = getServiceKey(service);

    const alreadySaved = savedServices.some(
      (item) => getServiceKey(item.service) === serviceKey
    );

    if (alreadySaved) {
      return;
    }

    try {
      setSavedError("");
      setSavedMessage("");

      const response = await fetch(`${API_BASE_URL}/saved-services`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(service),
      });

      const data = await response.json();

      if (response.status === 401) {
        handleLogout();
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to add this place to My Hub."
        );
      }

      setSavedServices((current) => {
        // Extra protection against duplicates
        const exists = current.some(
          (item) =>
            getServiceKey(item.service) ===
            getServiceKey(data.saved_service.service)
        );

        if (exists) {
          return current;
        }

        return [data.saved_service, ...current];
      });

      setSavedMessage(data.message || "Place added to My Hub");
    } catch (error) {
      console.error("Error adding to My Hub:", error);
      setSavedError(
        error.message || "Unable to add this place to My Hub."
      );
    }
  };

  // =========================
  // Update Place in My Hub
  // =========================

  const handleUpdateSavedService = async (id, updates) => {
    const token = getToken();

    try {
      setSavedError("");
      setSavedMessage("");

      const response = await fetch(
        `${API_BASE_URL}/saved-services/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updates),
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        handleLogout();
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || "Unable to update this place.");
      }

      setSavedServices((current) =>
        current.map((item) =>
          item.id === id ? data.saved_service : item
        )
      );

      // Temporary message based on what was updated
      if ("is_favorite" in updates) {
        setSavedMessage(
          updates.is_favorite
            ? "Added to favourites"
            : "Removed from favourites"
        );
      } else if ("note" in updates) {
        setSavedMessage("Note saved");
      } else {
        setSavedMessage(data.message || "Place updated successfully.");
      }
    } catch (error) {
      console.error("Update error:", error);
      setSavedError(
        error.message || "Unable to update this place."
      );
    }
  };

  // =========================
  // Remove Place from My Hub
  // =========================

  const handleRemoveSavedService = async (id) => {
    const token = getToken();

    try {
      setSavedError("");
      setSavedMessage("");

      const response = await fetch(
        `${API_BASE_URL}/saved-services/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const text = await response.text();
      let data = {};

      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        console.error("Server returned non-JSON:", text);
      }

      if (response.status === 401) {
        handleLogout();
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to remove this place."
        );
      }

      setSavedServices((current) =>
        current.filter((item) => item.id !== id)
      );

      setSavedMessage(
        data.message || "Place removed from My Hub"
      );
    } catch (error) {
      console.error("Remove error:", error);
      setSavedError(
        error.message || "Unable to remove this place."
      );
    }
  };

  // =========================
  // Authentication
  // =========================

  const handleAuthSuccess = (data) => {
    if (data.access_token) {
      localStorage.setItem(
        "hudumahub_token",
        data.access_token
      );
    }

    if (data.user) {
      localStorage.setItem(
        "hudumahub_user",
        JSON.stringify(data.user)
      );

      setUser(data.user);
    }

    setSavedError("");
    setSavedMessage("");
    setPage("home");
  };

  // =========================
  // Navigation
  // =========================

  const handleNavigate = (nextPage) => {
    setPage(nextPage);
  };

  // =========================
  // Saved Service IDs
  // =========================

  const savedServiceIds = new Set(
    savedServices.map((item) => getServiceKey(item.service))
  );

  // =========================
  // App Layout
  // =========================

  return (
    <div className="app">
      <Navbar
        user={user}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />

      <main className="main-content">
        {page === "home" && (
          <Home
            user={user}
            onAddToHub={handleAddToHub}
            savedServiceIds={savedServiceIds}
            getServiceKey={getServiceKey}
          />
        )}

        {page === "my-hub" && user && (
          <MyHub
            savedServices={savedServices}
            loading={savedLoading}
            error={savedError}
            message={savedMessage}
            onUpdate={handleUpdateSavedService}
            onRemove={handleRemoveSavedService}
            onNavigateHome={() => setPage("home")}
          />
        )}

        {page === "login" && (
          <Login
            onSuccess={handleAuthSuccess}
            onSwitchToRegister={() => setPage("register")}
          />
        )}

        {page === "register" && (
          <Register
            onSuccess={handleAuthSuccess}
            onSwitchToLogin={() => setPage("login")}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;