function ServiceCard({ service, onViewMap }) {
  const name = service.tags?.name || "Unnamed Service";
  const type = service.tags?.amenity || "Essential Service";

  const latitude = service.lat || service.center?.lat;
  const longitude = service.lon || service.center?.lon;

  const address =
    service.tags?.["addr:street"] ||
    service.tags?.["addr:full"] ||
    service.tags?.["addr:city"] ||
    "Address not available";

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