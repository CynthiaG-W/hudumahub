import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

function MapController({ selectedService }) {
  const map = useMap();

  useEffect(() => {
    if (!selectedService) {
      return;
    }

    const latitude =
      selectedService.lat || selectedService.center?.lat;

    const longitude =
      selectedService.lon || selectedService.center?.lon;

    if (latitude && longitude) {
      map.flyTo([latitude, longitude], 16);
    }
  }, [selectedService, map]);

  return null;
}

function MapView({ services, selectedService }) {
  const nairobiPosition = [-1.286389, 36.817223];

  return (
    <div className="map-container">
      <MapContainer
        center={nairobiPosition}
        zoom={12}
        scrollWheelZoom={true}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapController selectedService={selectedService} />

        {services.map((service) => {
          const latitude =
            service.lat || service.center?.lat;

          const longitude =
            service.lon || service.center?.lon;

          if (!latitude || !longitude) {
            return null;
          }

          return (
            <Marker
              key={`${service.type}-${service.id}`}
              position={[latitude, longitude]}
            >
              <Popup>
                <strong>
                  {service.tags?.name || "Unnamed Service"}
                </strong>

                <br />

                {service.tags?.amenity || "Essential Service"}
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

export default MapView;