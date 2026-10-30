'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Polygon, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Link from 'next/link';

// Basemaps matching Basera Warm Editorial palette
const BASEMAPS = {
  streets: {
    name: 'Standard Map',
    icon: 'map',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
  },
  light: {
    name: 'Clean Light',
    icon: 'light_mode',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
    maxZoom: 16,
  },
  satellite: {
    name: 'Satellite View',
    icon: 'satellite_alt',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri, Maxar, Earthstar Geographics',
    maxZoom: 19,
  },
};

// Component to handle mouse clicks and cursor movement on the map for polygon drawing
function MapEventsHandler({ isDrawing, onMapClick, onMouseMove }) {
  useMapEvents({
    click(e) {
      if (isDrawing) {
        onMapClick(e.latlng);
      }
    },
    mousemove(e) {
      if (isDrawing) {
        onMouseMove(e.latlng);
      }
    }
  });
  return null;
}

// Dynamic camera control using flyTo
function DynamicCameraControl({ coords, zoom = 13 }) {
  const map = useMap();
  useEffect(() => {
    if (coords && coords[0] && coords[1]) {
      map.flyTo(coords, zoom, {
        duration: 1.2,
        easeLinearity: 0.25,
      });
    }
  }, [coords, zoom, map]);
  return null;
}

export default function GeospatialMap({ listings = [], cityData, onPolygonChange }) {
  const [activeBasemap, setActiveBasemap] = useState('streets');
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawnPoints, setDrawnPoints] = useState([]);
  const [mousePos, setMousePos] = useState(null);
  const [finalPolygon, setFinalPolygon] = useState(null);

  // Bengaluru coordinates default
  const defaultCoords = [12.9716, 77.5946];
  const [center, setCenter] = useState(defaultCoords);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (listings.length > 0 && listings[0].coordinates?.lat) {
        setCenter([listings[0].coordinates.lat, listings[0].coordinates.lng]);
      } else if (cityData?.coordinates?.lat && cityData?.coordinates?.lng) {
        setCenter([cityData.coordinates.lat, cityData.coordinates.lng]);
      } else {
        setCenter([12.9716, 77.5946]);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [listings, cityData]);

  const handleMapClick = (latlng) => {
    setDrawnPoints(prev => [...prev, latlng]);
  };

  const handleMouseMove = (latlng) => {
    setMousePos(latlng);
  };

  const startDrawing = () => {
    setIsDrawing(true);
    setDrawnPoints([]);
    setMousePos(null);
    setFinalPolygon(null);
    onPolygonChange(null);
  };

  const cancelDrawing = () => {
    setIsDrawing(false);
    setDrawnPoints([]);
    setMousePos(null);
    setFinalPolygon(null);
    onPolygonChange(null);
  };

  const completeDrawing = () => {
    if (drawnPoints.length < 3) return;
    const closedPoints = [...drawnPoints, drawnPoints[0]];
    const formattedPoints = closedPoints.map(p => `${p.lng},${p.lat}`).join(';');
    
    setFinalPolygon(drawnPoints.map(p => [p.lat, p.lng]));
    setIsDrawing(false);
    setMousePos(null);
    onPolygonChange(formattedPoints);
  };

  const clearPolygon = () => {
    setDrawnPoints([]);
    setMousePos(null);
    setFinalPolygon(null);
    setIsDrawing(false);
    onPolygonChange(null);
  };

  // Helper to create custom HTML/CSS marker with clean white & terracotta design
  const createListingMarker = (item) => {
    if (typeof window === 'undefined') return null;
    const priceText = item.price?.displayText || (item.price?.value ? `₹${item.price.value.toLocaleString('en-IN')}` : 'Verified');
    
    return L.divIcon({
      className: 'custom-listing-pin',
      html: `
        <div style="
          display: flex;
          flex-direction: column;
          align-items: center;
          transform: translate(-50%, -100%);
          cursor: pointer;
        ">
          <!-- Marker Badge Pill (Warm white + terracotta border) -->
          <div style="
            background: #ffffff;
            color: #2d2621;
            padding: 4px 10px;
            border-radius: 9999px;
            font-family: system-ui, -apple-system, sans-serif;
            font-size: 11px;
            font-weight: 800;
            box-shadow: 0 4px 14px rgba(45,38,33,0.18);
            border: 1.5px solid ${item.isVerified ? '#c85a32' : 'rgba(45,38,33,0.15)'};
            display: flex;
            align-items: center;
            gap: 5px;
            white-space: nowrap;
          ">
            <span style="
              width: 7px;
              height: 7px;
              border-radius: 9999px;
              background: ${item.isVerified ? '#c85a32' : '#5b6951'};
            "></span>
            <span>${priceText}</span>
          </div>
          
          <!-- Bottom Pin Tip -->
          <div style="
            width: 0;
            height: 0;
            border-left: 5px solid transparent;
            border-right: 5px solid transparent;
            border-top: 6px solid #ffffff;
            filter: drop-shadow(0 2px 2px rgba(45,38,33,0.15));
          "></div>
        </div>
      `,
      iconSize: [0, 0],
      iconAnchor: [0, 0],
    });
  };

  return (
    <div className={`w-full h-full relative rounded-3xl overflow-hidden border border-[#2d2621]/10 shadow-lg bg-[#f5f0e8] flex flex-col ${isDrawing ? 'drawing-active-cursor' : ''}`}>
      
      {/* Top Left Basemap Switcher Toolbar */}
      <div className="absolute top-3 left-3 z-[1000] flex items-center gap-1 p-1 bg-white/90 backdrop-blur-md border border-[#2d2621]/10 rounded-2xl shadow-md">
        {Object.entries(BASEMAPS).map(([key, config]) => (
          <button
            key={key}
            onClick={() => setActiveBasemap(key)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
              activeBasemap === key
                ? 'bg-[#2d2621] text-white shadow-sm'
                : 'text-gray-600 hover:text-[#2d2621] hover:bg-black/5'
            }`}
            title={`Switch to ${config.name}`}
          >
            <span className="material-symbols-outlined text-[15px]">{config.icon}</span>
            <span className="hidden sm:inline">{config.name}</span>
          </button>
        ))}
      </div>

      {/* Top Right Drawing Controls Toolbar */}
      <div className="absolute top-3 right-3 z-[1000] bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-[#2d2621]/10 shadow-md flex items-center gap-2">
        {!isDrawing && !finalPolygon && (
          <button 
            onClick={startDrawing}
            className="bg-[#c85a32] hover:bg-[#b04d29] text-white text-[10px] font-extrabold uppercase tracking-wider px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
          >
            <span className="material-symbols-outlined text-[15px]">draw</span>
            <span>Draw Custom Zone</span>
          </button>
        )}

        {isDrawing && (
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-[#c85a32] font-bold uppercase tracking-wide animate-pulse pr-1">
              Nodes: {drawnPoints.length}
            </span>
            <button 
              disabled={drawnPoints.length < 3}
              onClick={completeDrawing}
              className="bg-[#2d2621] hover:bg-black disabled:opacity-40 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-xl transition flex items-center gap-1 cursor-pointer"
            >
              Apply Filter
            </button>
            <button 
              onClick={cancelDrawing}
              className="border border-[#2d2621]/20 hover:bg-black/5 text-gray-700 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>
          </div>
        )}

        {finalPolygon && (
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-[#5b6951] font-bold uppercase tracking-wide flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5b6951] animate-pulse"></span>
              Filtered Zone Active
            </span>
            <button 
              onClick={clearPolygon}
              className="bg-[#c85a32] hover:bg-[#b04d29] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-xl transition flex items-center gap-1 cursor-pointer"
            >
              Reset
            </button>
          </div>
        )}
      </div>

      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={true}
        className="w-full flex-grow z-0"
      >
        <DynamicCameraControl coords={center} zoom={13} />

        <TileLayer
          attribution={BASEMAPS[activeBasemap].attribution}
          url={BASEMAPS[activeBasemap].url}
          maxZoom={BASEMAPS[activeBasemap].maxZoom}
        />

        <MapEventsHandler 
          isDrawing={isDrawing} 
          onMapClick={handleMapClick} 
          onMouseMove={handleMouseMove}
        />

        {/* Dynamic dashed rubber-band line preview */}
        {isDrawing && drawnPoints.length > 0 && mousePos && (
          <Polyline 
            positions={[drawnPoints[drawnPoints.length - 1], mousePos]} 
            pathOptions={{
              color: '#a855f7',
              weight: 2,
              dashArray: '6, 6',
              opacity: 0.8,
            }}
          />
        )}

        {/* Connected path nodes */}
        {isDrawing && drawnPoints.length > 0 && (
          <Polyline 
            positions={drawnPoints.map(p => [p.lat, p.lng])} 
            pathOptions={{
              color: '#8b5cf6',
              weight: 3,
            }}
          />
        )}

        {/* Node markers with closing indicator */}
        {isDrawing && drawnPoints.map((pt, idx) => {
          const isFirstNode = idx === 0;
          const showCloseHint = isFirstNode && drawnPoints.length >= 3;
          
          const nodeIcon = typeof window !== 'undefined' ? L.divIcon({
            className: `drawing-node-marker`,
            html: `
              <div class="relative flex items-center justify-center -translate-x-1/2 -translate-y-1/2">
                ${showCloseHint ? '<div class="absolute w-6 h-6 bg-emerald-400/40 rounded-full animate-ping"></div>' : ''}
                <div class="w-3.5 h-3.5 rounded-full border-2 border-white shadow-lg ${
                  showCloseHint ? 'bg-emerald-400 scale-125' : 'bg-rose-500'
                }"></div>
              </div>
            `,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
          }) : null;

          return (
            <Marker 
              key={idx} 
              position={[pt.lat, pt.lng]} 
              icon={nodeIcon || undefined}
              eventHandlers={{
                click: () => {
                  if (showCloseHint) {
                    completeDrawing();
                  }
                }
              }}
            />
          );
        })}

        {/* Finalized search boundary polygon */}
        {finalPolygon && (
          <Polygon 
            positions={finalPolygon} 
            pathOptions={{
              color: '#6366f1',
              weight: 2.5,
              fillColor: '#818cf8',
              fillOpacity: 0.22,
              dashArray: '4, 4',
            }}
          />
        )}

        {/* Custom Listings Markers */}
        {listings.map(item => {
          if (!item.coordinates || !item.coordinates.lat || !item.coordinates.lng) return null;
          const markerIcon = createListingMarker(item);

          return (
            <Marker
              key={item._id}
              position={[item.coordinates.lat, item.coordinates.lng]}
              icon={markerIcon || undefined}
            >
              <Popup className="custom-leaflet-popup">
                <div className="p-3 min-w-[210px] flex flex-col gap-2 font-plus-jakarta bg-white text-[#2d2621] rounded-2xl">
                  <div className="flex items-center justify-between gap-2">
                    <span className="bg-[#f5f0e8] text-[#2d2621] text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border border-[#2d2621]/10">
                      {item.subcategory || 'Stay'}
                    </span>
                    {item.isVerified && (
                      <span className="flex items-center gap-1 text-[10px] text-[#c85a32] font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#c85a32] animate-pulse"></span>
                        Verified
                      </span>
                    )}
                  </div>

                  <h4 className="font-editorial text-[14px] font-bold text-[#2d2621] leading-snug">{item.name}</h4>
                  <p className="text-[10px] text-gray-500 font-medium truncate flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px] text-[#c85a32]">location_on</span>
                    {item.locality || cityData?.name}
                  </p>
                  
                  <div className="text-xs font-bold text-[#2d2621] border-t border-[#2d2621]/10 pt-2 flex justify-between items-center">
                    <span className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">Rate:</span>
                    <span className="text-[#c85a32] font-editorial text-[14px] font-bold">{item.price?.displayText || 'On Request'}</span>
                  </div>
                  
                  <Link
                    href={`/${cityData?.slug || 'city'}/${item.category?.slug || 'housing'}/${item._id}`}
                    className="w-full bg-[#2d2621] hover:bg-black text-white py-2 rounded-xl text-[10px] font-extrabold uppercase tracking-widest text-center block mt-1 transition-all shadow-sm"
                  >
                    View Details
                  </Link>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      <style jsx global>{`
        .drawing-active-cursor .leaflet-container {
          cursor: crosshair !important;
        }
      `}</style>
    </div>
  );
}
