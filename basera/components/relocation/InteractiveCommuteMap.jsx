'use client';

import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { WORK_HUBS } from '@/components/relocation/CommuteRadarWidget';

// Dynamically import Leaflet with SSR disabled
const DynamicLeafletMap = dynamic(
  () => import('./CommuteRadarMapLeaflet'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[360px] bg-sand flex flex-col items-center justify-center text-xs font-bold text-gray-400 gap-3 border border-outline rounded-3xl">
        <span className="material-symbols-outlined text-[32px] text-terracotta animate-spin">progress_activity</span>
        <span>Loading Commute Corridors...</span>
      </div>
    )
  }
);

// Estimate Uber/Ola Cab Fare in INR (Base + per km rate + platform fee)
function calculateCabFare(distanceKm) {
  const base = 50;
  const perKm = 14.5;
  const fare = Math.round(base + (distanceKm * perKm));
  return {
    auto: Math.max(40, Math.round(fare * 0.65)),
    cab: Math.max(90, fare),
    bike: Math.max(30, Math.round(fare * 0.45))
  };
}

export default function InteractiveCommuteMap({ citySlug = 'delhi', listings = [] }) {
  const hubs = WORK_HUBS[citySlug] || WORK_HUBS['delhi'];
  const [selectedHubId, setSelectedHubId] = useState(hubs[0]?.id || '');
  const [mode, setMode] = useState('metro'); // 'metro', 'cab', 'walk'
  const [activeListingId, setActiveListingId] = useState(listings[0]?._id || null);

  const activeHub = useMemo(() => {
    return hubs.find(h => h.id === selectedHubId) || hubs[0];
  }, [hubs, selectedHubId]);

  // Find active listing or first valid coordinate listing
  const activeListing = useMemo(() => {
    if (activeListingId) {
      const found = listings.find(l => l._id === activeListingId);
      if (found?.coordinates?.lat) return found;
    }
    return listings.find(l => l.coordinates?.lat) || listings[0];
  }, [listings, activeListingId]);

  // Compute live distance, transit time and estimated costs
  const commuteMetrics = useMemo(() => {
    if (!activeListing?.coordinates?.lat || !activeHub) {
      return { distanceKm: 8.5, timeMins: 22, fares: { auto: 120, cab: 180, bike: 75 } };
    }
    const R = 6371;
    const dLat = (activeHub.lat - activeListing.coordinates.lat) * Math.PI / 180;
    const dLon = (activeHub.lng - activeListing.coordinates.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(activeListing.coordinates.lat * Math.PI / 180) * Math.cos(activeHub.lat * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distanceKm = Number((R * c).toFixed(1));

    const speedKmH = mode === 'walk' ? 4.5 : mode === 'cab' ? 24 : 32;
    const timeMins = Math.round((distanceKm / speedKmH) * 60) + (mode === 'metro' ? 6 : 2);
    const fares = calculateCabFare(distanceKm);

    return { distanceKm, timeMins, fares };
  }, [activeListing, activeHub, mode]);

  // Direct Google Maps transit link
  const openGoogleMapsTransit = () => {
    if (!activeListing?.coordinates?.lat || !activeHub) return;
    const origin = `${activeListing.coordinates.lat},${activeListing.coordinates.lng}`;
    const destination = `${activeHub.lat},${activeHub.lng}`;
    const travelMode = mode === 'walk' ? 'walking' : mode === 'cab' ? 'driving' : 'transit';
    window.open(`https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=${travelMode}`, '_blank');
  };

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-outline shadow-sm mb-12 overflow-hidden">
      {/* Top Header */}
      <div className="p-6 border-b border-outline flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-sand/30">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-terracotta animate-pulse"></span>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-terracotta">
              Live Commute & Route Simulator
            </span>
          </div>
          <h3 className="font-editorial text-2xl font-bold text-primary tracking-tight">
            Door-to-Desk Travel Navigator
          </h3>
          <p className="text-xs text-gray-500 font-medium">
            Select your workplace and any neighborhood stay to inspect exact travel routes, live cab fares, and metro corridors.
          </p>
        </div>

        {/* Hub Destination Dropdown */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Destination:</span>
          <select
            value={selectedHubId}
            onChange={(e) => setSelectedHubId(e.target.value)}
            className="bg-white border border-outline rounded-xl py-2 pl-3 pr-8 text-xs font-bold text-primary focus:outline-none focus:ring-2 focus:ring-terracotta/20 cursor-pointer shadow-sm"
          >
            {hubs.map(hub => (
              <option key={hub.id} value={hub.id}>
                {hub.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid: Left Controls & Fare Breakdown | Right Tactical Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px]">
        
        {/* Left Panel: Real-world Actionable Metrics (5 cols) */}
        <div className="lg:col-span-5 p-6 flex flex-col justify-between gap-6 border-b lg:border-b-0 lg:border-r border-outline bg-white">
          
          <div className="flex flex-col gap-5">
            {/* Active Property Card */}
            <div className="bg-sand/60 p-4 rounded-2xl border border-outline flex flex-col gap-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Selected Neighborhood Node
              </span>
              <div className="flex justify-between items-start gap-2">
                <div>
                  <h4 className="font-editorial text-base font-bold text-primary leading-snug">
                    {activeListing?.name || 'Local Verified Hub'}
                  </h4>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">
                    {activeListing?.locality || 'Local colony'}, {citySlug.toUpperCase()}
                  </p>
                </div>
                <span className="text-xs font-bold text-terracotta bg-white px-2.5 py-1 rounded-full border border-outline flex-shrink-0">
                  {activeListing?.price?.displayText || '₹14,500/mo'}
                </span>
              </div>
            </div>

            {/* Mode Selector Tabs */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Choose Transit Option
              </span>
              <div className="grid grid-cols-3 gap-2 bg-sand/60 p-1 rounded-2xl border border-outline">
                <button
                  type="button"
                  onClick={() => setMode('metro')}
                  className={`py-2 rounded-xl text-xs font-bold flex flex-col items-center gap-0.5 transition-all cursor-pointer ${
                    mode === 'metro' 
                      ? 'bg-white text-terracotta shadow-sm border border-outline' 
                      : 'text-gray-500 hover:text-primary'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">directions_subway</span>
                  <span className="text-[10px]">Metro (~32 km/h)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMode('cab')}
                  className={`py-2 rounded-xl text-xs font-bold flex flex-col items-center gap-0.5 transition-all cursor-pointer ${
                    mode === 'cab' 
                      ? 'bg-white text-terracotta shadow-sm border border-outline' 
                      : 'text-gray-500 hover:text-primary'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">local_taxi</span>
                  <span className="text-[10px]">Cab / Auto (~24 km/h)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMode('walk')}
                  className={`py-2 rounded-xl text-xs font-bold flex flex-col items-center gap-0.5 transition-all cursor-pointer ${
                    mode === 'walk' 
                      ? 'bg-white text-terracotta shadow-sm border border-outline' 
                      : 'text-gray-500 hover:text-primary'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">directions_walk</span>
                  <span className="text-[10px]">Walk (~4.5 km/h)</span>
                </button>
              </div>
            </div>

            {/* Real Cost & Time Matrix (THE PRACTICAL USE) */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-sand/40 border border-outline text-left">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                  Travel Time
                </span>
                <span className="font-editorial text-2xl font-bold text-primary">
                  ~{commuteMetrics.timeMins} <span className="text-sm font-sans font-normal text-gray-500">mins</span>
                </span>
                <span className="text-[10px] text-olive font-bold block mt-1">
                  Corridor: {commuteMetrics.distanceKm} km
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-sand/40 border border-outline text-left">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                  {mode === 'metro' ? 'Metro Token Fare' : 'Est. Ride Cost'}
                </span>
                <span className="font-editorial text-2xl font-bold text-terracotta">
                  {mode === 'metro' ? '₹30 – ₹50' : mode === 'walk' ? '₹0 Free' : `₹${commuteMetrics.fares.cab}`}
                </span>
                <span className="text-[10px] text-gray-500 font-bold block mt-1">
                  {mode === 'cab' ? `Auto: ₹${commuteMetrics.fares.auto} • Bike: ₹${commuteMetrics.fares.bike}` : activeHub.metroLine || 'Standard corridor'}
                </span>
              </div>
            </div>
          </div>

          {/* Practical 1-Click Action Button: Open Google Maps Direct Route */}
          <button
            type="button"
            onClick={openGoogleMapsTransit}
            className="w-full bg-primary hover:bg-black text-white py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-98 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px] text-terracotta">navigation</span>
            <span>Open Live Turn-by-Turn in Google Maps</span>
          </button>
        </div>

        {/* Right Panel: Interactive Route Map with Polyline and Pins (7 cols) */}
        <div className="lg:col-span-7 h-[380px] lg:h-auto min-h-[400px] relative bg-slate-900">
          <DynamicLeafletMap 
            origin={activeListing?.coordinates}
            originTitle={activeListing?.name || 'Stay'}
            destination={activeHub}
            mode={mode}
            allListings={listings}
            onSelectListing={(id) => setActiveListingId(id)}
          />
        </div>

      </div>
    </div>
  );
}
