function ServiceCard({ service }) {
  const name = service.tags?.name || "Unnamed service";
  const type = service.tags?.amenity || "Essential service";

  const latitude = service.lat || service.center?.lat;
  const longitude = service.lon || service.center?.lon;

  return (
    <div className="service-card">
      <h3>{name}</h3>

      <p>
        <strong>Type:</strong> {type}
      </p>

      {latitude && longitude && (
        <p>
          📍 {latitude.toFixed(4)}, {longitude.toFixed(4)}
        </p>
      )}
    </div>
  );
}

export default ServiceCard;