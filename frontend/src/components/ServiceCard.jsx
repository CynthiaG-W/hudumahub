import { useState } from "react";

function ServiceCard({
  service,
  isSelected,
  onSelect,
  user,
  onAddToHub,
  isSaved,
}) {
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (isSaved || saving) return;

    setSaving(true);

    try {
      await onAddToHub(service);
    } finally {
      setSaving(false);
    }
  };

  return (
    <article
      className={`service-card ${
        isSelected ? "is-selected" : ""
      }`}
    >
      <div className="service-card-content">
        <div className="service-card-header">
          <span className="service-category">
            {service.category || "Service"}
          </span>
        </div>

        <h3>{service.name}</h3>

        <p className="service-address">
          <span className="location-icon">📍</span>
          {service.address || "Address not available"}
        </p>
      </div>

      <div className="service-card-actions">
        <button
          className="view-map-button"
          onClick={onSelect}
        >
          <span>🗺️</span>
          View map
        </button>

        <button
          className={`save-button ${
            isSaved ? "is-saved" : ""
          }`}
          onClick={handleSave}
          disabled={isSaved || saving}
        >
          {isSaved ? (
            <>
              <span>✓</span>
              Saved to Hub
            </>
          ) : saving ? (
            "Saving..."
          ) : (
            <>
              <span>♡</span>
              Save to Hub
            </>
          )}
        </button>
      </div>
    </article>
  );
}

export default ServiceCard;