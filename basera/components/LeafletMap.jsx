'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Basemap layer providers matching tactical and GIS reference specs
const BASEMAPS = {
  dark: {
    name: 'Dark Canvas',
    icon: 'dark_mode',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
    maxZoom: 16,
  },
  satellite: {
    name: 'Satellite Imagery',
    icon: 'satellite_alt',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri, Maxar, Earthstar Geographics, CNES/Airbus DS',
    maxZoom: 19,
  },
  streets: {
    name: 'Street View',
    icon: 'map',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
  },
};

// Dynamic camera controller with smooth flyTo animation
function DynamicFlyTo({ coords, zoom = 15 }) {
  const map = useMap();
  useEffect(() => {
    if (coords && coords[0] && coords[1]) {
      map.flyTo(coords, zoom, {
        duration: 1.5,
        easeLinearity: 0.25,
      });
    }
  }, [coords, zoom, map]);
  return null;
}

export default function LeafletMap({ coordinates, title, address, category = 'Stay' }) {
  const [activeBasemap, setActiveBasemap] = useState('dark');
  const [showRadius, setShowRadius] = useState(true);

  // Fallback to Bengaluru if coordinates are not provided
  const position = (coordinates && coordinates.lat && coordinates.lng)
    ? [coordinates.lat, coordinates.lng]
    : [12.9716, 77.5946];

  // Custom high-visibility HTML marker pin with pulsating halo rings
  const customPulseIcon = typeof window !== 'undefined' ? L.divIcon({
    className: 'custom-pulse-marker',
    html: `
      <div class="relative flex items-center justify-center -translate-x-1/2 -translate-y-1/2">
        <!-- Pulsing Radar Halo Rings -->
        <div class="absolute w-12 h-12 rounded-full bg-primary-500/30 radar-ping pointer-events-none"></div>
        <div class="absolute w-8 h-8 rounded-full bg-indigo-400/40 animate-ping pointer-events-none"></div>

        <!-- Glowing Core Pin -->
        <div class="relative w-9 h-9 rounded-2xl bg-gradient-to-tr from-primary-600 to-indigo-500 border-2 border-white/90 shadow-[0_0_20px_rgba(99,102,241,0.8)] flex items-center justify-center text-white transition-transform transform hover:scale-110">
          <span class="material-symbols-outlined text-[18px]">location_on</span>
        </div>

        <!-- Arrow Stem Beacon -->
        <div class="absolute -bottom-1.5 w-2 h-2 rotate-45 bg-primary-600 border-r border-b border-white/80"></div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  }) : null;

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-slate-950">
      {/* Top & Bottom Vignette Scrim Overlays */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-slate-950/80 via-slate-950/30 to-transparent z-20" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950/85 via-slate-950/35 to-transparent z-20" />

      {/* Interactive Floating Basemap Switcher Toolbar */}
      <div className="absolute top-4 right-4 z-30 flex items-center gap-1.5 p-1 bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl">
        {Object.entries(BASEMAPS).map(([key, config]) => (
          <button
            key={key}
            onClick={() => setActiveBasemap(key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeBasemap === key
                ? 'bg-primary-600 text-white shadow-md shadow-primary-600/30'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
            title={`Switch to ${config.name}`}
          >
            <span className="material-symbols-outlined text-sm">{config.icon}</span>
            <span className="hidden sm:inline">{config.name}</span>
          </button>
        ))}

        {/* 500m Walkability Radius Toggle */}
        <button
          onClick={() => setShowRadius(prev => !prev)}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border-l border-white/10 ${
            showRadius
              ? 'text-emerald-400 bg-emerald-500/10'
              : 'text-slate-400 hover:text-white'
          }`}
          title="Toggle 500m Walkability Perimeter"
        >
          <span className="material-symbols-outlined text-sm">radar</span>
          <span className="hidden md:inline">500m Walk</span>
        </button>
      </div>

      <MapContainer
        center={position}
        zoom={15}
        scrollWheelZoom={true}
        className="w-full h-full z-0"
      >
        <DynamicFlyTo coords={position} zoom={15} />

        <TileLayer
          attribution={BASEMAPS[activeBasemap].attribution}
          url={BASEMAPS[activeBasemap].url}
          maxZoom={BASEMAPS[activeBasemap].maxZoom}
        />

        {/* 500m Geofenced Walkability Circle */}
        {showRadius && (
          <Circle
            center={position}
            radius={500}
            pathOptions={{
              color: '#6366f1',
              weight: 1.5,
              dashArray: '6, 6',
              fillColor: '#818cf8',
              fillOpacity: 0.12,
            }}
          />
        )}

        {/* Custom Glowing Marker */}
        <Marker position={position} icon={customPulseIcon || undefined}>
          <Popup className="custom-leaflet-popup">
            <div className="p-4 min-w-[200px] flex flex-col gap-2 font-plus-jakarta bg-slate-900 text-white">
              <div className="flex items-center justify-between gap-2">
                <span className="bg-primary-500/20 border border-primary-500/30 text-primary-300 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                  {category}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Verified
                </span>
              </div>
              <h4 className="font-extrabold text-sm text-white leading-snug">{title}</h4>
              <p className="text-xs text-slate-300 font-medium leading-relaxed">{address}</p>
              <div className="pt-2 mt-1 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400 font-semibold">
                <span>Walkability Zone</span>
                <span className="text-primary-300">~6 mins walk</span>
              </div>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
