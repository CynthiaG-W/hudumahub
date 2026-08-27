function ServiceCard({ service, onViewMap }) {
  const name = service.name || "Unnamed Service";
  const type = service.category || "Essential Service";

  const latitude = service.latitude;
  const longitude = service.longitude;

  const address = service.address || "Address not available";

  return (
    <div className="service-card">
      <h3>{name}</h3>

      <p className="service-type">
        {type}
      </p>

      <p className="service-address">
        📍 {address}
      </p>

      {latitude && longitude && (
        <button
          className="view-map-button"
          onClick={() => onViewMap(service)}
        >
          View on Map
        </button>
      )}
    </div>
  );
}

export default ServiceCard;