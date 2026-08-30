import { useEffect, useRef } from "react";
import {
MapContainer,
Marker,
Popup,
TileLayer,
useMap,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
iconRetinaUrl:
"https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
iconUrl:
"https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
shadowUrl:
"https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function FlyToSelectedService({ service }) {
const map = useMap();

useEffect(() => {
if (
!service ||
service.latitude == null ||
service.longitude == null
) {
return;
}

const latitude = Number(service.latitude);
const longitude = Number(service.longitude);

if (
  Number.isNaN(latitude) ||
  Number.isNaN(longitude)
) {
  return;
}

map.flyTo(
  [latitude, longitude],
  16,
  {
    duration: 1.2,
  }
);

}, [service, map]);

return null;
}

function ServiceMarker({
service,
index,
isSelected,
onSelectService,
}) {
const markerRef = useRef(null);

useEffect(() => {
if (isSelected && markerRef.current) {
markerRef.current.openPopup();
}
}, [isSelected]);

const latitude = Number(service.latitude);
const longitude = Number(service.longitude);

return (
<Marker
ref={markerRef}
position={[latitude, longitude]}
eventHandlers={{
click: () => onSelectService(service),
}}
> <Popup> <div className="map-popup"> <strong>{service.name || "Service location"}</strong>

      {service.category && (
        <>
          <br />
          <span>{service.category}</span>
        </>
      )}

      {service.address && (
        <>
          <br />
          <small>{service.address}</small>
        </>
      )}
    </div>
  </Popup>
</Marker>

);
}

function MapView({
services,
selectedService,
onSelectService,
}) {
// Nairobi fallback coordinates
const defaultCenter = [-1.286389, 36.817223];

const validServices = services.filter((service) => {
const latitude = Number(service.latitude);
const longitude = Number(service.longitude);

return (
  service.latitude != null &&
  service.longitude != null &&
  !Number.isNaN(latitude) &&
  !Number.isNaN(longitude)
);

});

const center =
validServices.length > 0
? [
Number(validServices[0].latitude),
Number(validServices[0].longitude),
]
: defaultCenter;

const isSameService = (service) =>
selectedService &&
service.osm_type === selectedService.osm_type &&
service.osm_id === selectedService.osm_id;

return ( <div className="map-container">
<MapContainer
center={center}
zoom={12}
scrollWheelZoom={true}
style={{
height: "420px",
width: "100%",
}}
> <TileLayer
       attribution="&copy; OpenStreetMap contributors"
       url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
     />

    <FlyToSelectedService
      service={selectedService}
    />

    {validServices.map((service, index) => (
      <ServiceMarker
        key={`${service.osm_type || "service"}-${
          service.osm_id || index
        }`}
        service={service}
        index={index}
        isSelected={isSameService(service)}
        onSelectService={onSelectService}
      />
    ))}
  </MapContainer>
</div>

);
}

export default MapView;
