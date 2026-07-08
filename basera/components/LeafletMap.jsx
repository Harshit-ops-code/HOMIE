'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Import leaflet styles directly
import 'leaflet/dist/leaflet.css';

export default function LeafletMap({ coordinates, title, address }) {
  // Fix for default Leaflet marker icon asset resolution issues in bundle processes
  useEffect(() => {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
  }, []);

  const position = coordinates && coordinates.lat && coordinates.lng 
    ? [coordinates.lat, coordinates.lng] 
    : [12.9716, 77.5946]; // Fallback to Bengaluru

  return (
    <MapContainer 
      center={position} 
      zoom={14} 
      scrollWheelZoom={true} 
      className="w-full h-full rounded-card overflow-hidden border border-outline-variant/30"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup>
          <div className="p-1">
            <h4 className="font-bold text-sm text-primary mb-0.5">{title}</h4>
            <p className="text-xs text-gray-500 font-semibold m-0">{address}</p>
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
}
