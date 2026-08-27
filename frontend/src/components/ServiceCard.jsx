import { useState } from "react";

const API_BASE_URL = "http://127.0.0.1:5000/api";

function ServiceCard({ service, onViewMap, user }) {
  const name = service.name || "Unnamed Service";
  const type = service.category || "Essential Service";

  const latitude = service.latitude;
  const longitude = service.longitude;

  const address =
    service.address || "Address not available";

  const [saved, setSaved] = useState(false);
  const [savedServiceId, setSavedServiceId] =
    useState(null);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const handleSave = async () => {
    if (!user) {
      setSaveMessage("Please log in to save services.");
      return;
    }

    const token = localStorage.getItem(
      "hudumahub_token"
    );

    if (!token) {
      setSaveMessage("Please log in to save services.");
      return;
    }

    setSaving(true);
    setSaveMessage("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/saved-services`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            service_id: service.id,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (
          response.status === 409 ||
          data.error === "Service already saved"
        ) {
          setSaved(true);
          setSaveMessage("Service already saved.");
        } else {
          throw new Error(
            data.error || "Unable to save service"
          );
        }

        return;
      }

      setSaved(true);
      setSavedServiceId(data.id);
      setSaveMessage("Service saved successfully.");
    } catch (error) {
      console.error("Save service error:", error);
      setSaveMessage(
        "Unable to save service. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async () => {
    if (!user) {
      return;
    }

    const token = localStorage.getItem(
      "hudumahub_token"
    );

    if (!token || !savedServiceId) {
      return;
    }

    setSaving(true);
    setSaveMessage("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/saved-services/${savedServiceId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to remove saved service"
        );
      }

      setSaved(false);
      setSavedServiceId(null);
      setSaveMessage("Service removed from saved services.");
    } catch (error) {
      console.error(
        "Remove saved service error:",
        error
      );

      setSaveMessage(
        "Unable to remove service. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="service-card">
      <h3>{name}</h3>

      <p className="service-type">
        {type}
      </p>

      <p className="service-address">
        📍 {address}
      </p>

      <div className="service-card-actions">
        {latitude && longitude && (
          <button
            className="view-map-button"
            onClick={() => onViewMap(service)}
          >
            View on Map
          </button>
        )}

        {saved ? (
          <button
            className="save-service-button saved"
            onClick={handleRemove}
            disabled={saving}
          >
            {saving
              ? "Removing..."
              : "✓ Saved"}
          </button>
        ) : (
          <button
            className="save-service-button"
            onClick={handleSave}
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : "♡ Save Service"}
          </button>
        )}
      </div>

      {saveMessage && (
        <p className="save-service-message">
          {saveMessage}
        </p>
      )}
    </div>
  );
}

export default ServiceCard;