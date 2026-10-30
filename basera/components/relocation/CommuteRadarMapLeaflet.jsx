'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet's default icon assets for Next.js bundler
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom stylized SVG pin markers
const createPinIcon = (color, label, iconText) => {
  return L.divIcon({
    className: 'custom-commute-pin',
    html: `
      <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        transform: translate(-50%, -100%);
        pointer-events: auto;
        cursor: pointer;
      ">
        <div style="
          background: ${color};
          color: white;
          padding: 4px 8px;
          border-radius: 9999px;
          font-family: system-ui, sans-serif;
          font-size: 10px;
          font-weight: 800;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          border: 2px solid white;
          display: flex;
          align-items: center;
          gap: 4px;
          white-space: nowrap;
        ">
          <span style="font-family: 'Material Symbols Outlined'; font-size: 13px;">${iconText}</span>
          <span>${label}</span>
        </div>
        <div style="
          width: 0;
          height: 0;
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          border-top: 6px solid ${color};
        "></div>
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
};

function AutoFitBounds({ points }) {
  const map = useMap();

  useEffect(() => {
    if (!points || points.length < 2) return;
    const validPoints = points.filter(p => p && p[0] && p[1]);
    if (validPoints.length >= 2) {
      const bounds = L.latLngBounds(validPoints);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15, animate: true });
    }
  }, [map, points]);

  return null;
}

export default function CommuteRadarMapLeaflet({
  origin,
  originTitle = 'Selected Stay',
  destination,
  mode = 'metro',
  allListings = [],
  onSelectListing
}) {
  const originLat = origin?.lat || 28.5244;
  const originLng = origin?.lng || 77.2167;
  const destLat = destination?.lat || 28.4950;
  const destLng = destination?.lng || 77.0895;

  const routePolyline = [
    [originLat, originLng],
    [destLat, destLng]
  ];

  const strokeColor = mode === 'walk' ? '#4a5d4e' : mode === 'cab' ? '#e29d38' : '#c85a32';
  const strokeDash = mode === 'metro' ? '8, 8' : mode === 'walk' ? '4, 8' : null;

  return (
    <div className="w-full h-full min-h-[400px] relative">
      <MapContainer
        center={[originLat, originLng]}
        zoom={13}
        scrollWheelZoom={false}
        className="w-full h-full min-h-[400px] z-0"
        style={{ background: '#1c1917' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <AutoFitBounds points={routePolyline} />

        {/* 500m Walk Perimeter around the stay */}
        <Circle
          center={[originLat, originLng]}
          radius={500}
          pathOptions={{
            color: '#c85a32',
            fillColor: '#c85a32',
            fillOpacity: 0.12,
            weight: 1.5,
            dashArray: '3, 6'
          }}
        />

        {/* Route Corridor Polyline */}
        <Polyline
          positions={routePolyline}
          pathOptions={{
            color: strokeColor,
            weight: 4,
            opacity: 0.85,
            dashArray: strokeDash
          }}
        />

        {/* Origin Marker (Stay) */}
        <Marker
          position={[originLat, originLng]}
          icon={createPinIcon('#c85a32', originTitle, 'home_pin')}
        >
          <Popup>
            <div className="p-1">
              <strong className="text-xs font-bold text-gray-900 block">{originTitle}</strong>
              <span className="text-[10px] text-gray-500">Your Starting Point</span>
            </div>
          </Popup>
        </Marker>

        {/* Destination Marker (Workplace) */}
        <Marker
          position={[destLat, destLng]}
          icon={createPinIcon('#2d2621', destination?.name || 'Workplace Hub', 'domain')}
        >
          <Popup>
            <div className="p-1">
              <strong className="text-xs font-bold text-gray-900 block">{destination?.name || 'Workplace'}</strong>
              <span className="text-[10px] text-gray-500">{destination?.metroLine || 'Employment Destination'}</span>
            </div>
          </Popup>
        </Marker>

        {/* Other Nearby Listings on Map */}
        {allListings.map(listing => {
          if (!listing.coordinates?.lat || !listing.coordinates?.lng) return null;
          const isSelected = listing.coordinates.lat === originLat && listing.coordinates.lng === originLng;
          if (isSelected) return null;

          return (
            <Marker
              key={listing._id}
              position={[listing.coordinates.lat, listing.coordinates.lng]}
              icon={L.divIcon({
                className: 'listing-dot-pin',
                html: `
                  <div style="
                    width: 12px;
                    height: 12px;
                    background: #c85a32;
                    border: 2px solid white;
                    border-radius: 9999px;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                    cursor: pointer;
                  "></div>
                `,
                iconSize: [12, 12],
                iconAnchor: [6, 6]
              })}
              eventHandlers={{
                click: () => {
                  if (onSelectListing) onSelectListing(listing._id);
                }
              }}
            >
              <Popup>
                <div className="p-1 cursor-pointer" onClick={() => onSelectListing && onSelectListing(listing._id)}>
                  <strong className="text-xs font-bold text-gray-900 block">{listing.name}</strong>
                  <span className="text-[10px] text-terracotta font-bold">
                    {listing.price?.displayText || 'View Commute'}
                  </span>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Map Legend & Corridor Info Overlay */}
      <div className="absolute bottom-3 left-3 z-[1000] bg-white/90 backdrop-blur-md px-3 py-2 rounded-xl border border-outline shadow-md flex items-center gap-3 text-[10px] font-bold text-gray-700">
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-terracotta"></span>
          <span>Stay</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
          <span>Office</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="w-4 h-0.5 bg-terracotta border border-dashed border-terracotta"></span>
          <span className="capitalize">{mode} Route</span>
        </span>
      </div>
    </div>
  );
}
