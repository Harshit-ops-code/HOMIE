'use client';

import { useState, useMemo, useEffect } from 'react';

// Tech parks and employment hubs per city
export const WORK_HUBS = {
  delhi: [
    { id: 'cyber-city', name: 'DLF Cyber City / CyberHub', lat: 28.4950, lng: 77.0895, metroLine: 'Rapid Metro / Yellow Line' },
    { id: 'connaught-place', name: 'Connaught Place / Barakhamba', lat: 28.6315, lng: 77.2167, metroLine: 'Blue / Yellow Interchange' },
    { id: 'noida-sec62', name: 'Noida Sector 62 / Tech Zone', lat: 28.6280, lng: 77.3649, metroLine: 'Blue Line' },
    { id: 'saket-district', name: 'Saket District Centre / Aerocity', lat: 28.5244, lng: 77.2167, metroLine: 'Yellow Line' },
    { id: 'nehru-place', name: 'Nehru Place Financial Hub', lat: 28.5492, lng: 77.2529, metroLine: 'Violet / Magenta Line' }
  ],
  hyderabad: [
    { id: 'cyber-towers', name: 'HITEC City / Cyber Towers', lat: 17.4504, lng: 78.3808, metroLine: 'Blue Line' },
    { id: 'mindspace', name: 'Mindspace IT Park, Madhapur', lat: 17.4399, lng: 78.3792, metroLine: 'Blue Line' },
    { id: 'financial-district', name: 'Financial District, Gachibowli', lat: 17.4156, lng: 78.3375, metroLine: 'ORR Shuttle / Metro Phase 2' },
    { id: 'banjara-hills', name: 'Banjara Hills / Jubilee Hills Hub', lat: 17.4156, lng: 78.4350, metroLine: 'Blue / Red Line' }
  ],
  bengaluru: [
    { id: 'koramangala', name: 'Koramangala 5th Block Startup Hub', lat: 12.9352, lng: 77.6245, metroLine: 'Yellow Line / Bus Priority' },
    { id: 'manyata', name: 'Manyata Tech Park, Hebbal', lat: 13.0494, lng: 77.6200, metroLine: 'Blue Line Airport Corridor' },
    { id: 'ecity', name: 'Electronic City Phase 1', lat: 12.8452, lng: 77.6602, metroLine: 'Yellow Elevated Metro' },
    { id: 'bagmane', name: 'Bagmane Tech Park, CV Raman Nagar', lat: 12.9800, lng: 77.6580, metroLine: 'Purple Line' }
  ],
  mumbai: [
    { id: 'bkc', name: 'Bandra Kurla Complex (BKC)', lat: 19.0657, lng: 72.8687, metroLine: 'Metro Line 3 / Western Suburb' },
    { id: 'andheri-east', name: 'Andheri East MIDC / SEEPZ', lat: 19.1197, lng: 72.8664, metroLine: 'Metro Line 1' },
    { id: 'lower-parel', name: 'Lower Parel / One World Centre', lat: 18.9953, lng: 72.8306, metroLine: 'Western / Central Suburban' }
  ],
  pune: [
    { id: 'hinjawadi', name: 'Hinjawadi Rajiv Gandhi Infotech Park', lat: 18.5913, lng: 73.7389, metroLine: 'Metro Line 3 Corridor' },
    { id: 'magarpatta', name: 'Magarpatta Cybercity, Hadapsar', lat: 18.5134, lng: 73.9298, metroLine: 'BRTS Corridor' },
    { id: 'kalyani-nagar', name: 'Kalyani Nagar / Viman Nagar IT Hub', lat: 18.5463, lng: 73.9033, metroLine: 'Metro Line 2' }
  ]
};

// Haversine distance calculator in KM
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export default function CommuteRadarWidget({ citySlug, onFilterChange }) {
  const hubs = WORK_HUBS[citySlug] || WORK_HUBS['delhi'];
  const [selectedHubId, setSelectedHubId] = useState(hubs[0]?.id || '');
  const [maxMinutes, setMaxMinutes] = useState(30);
  const [mode, setMode] = useState('metro'); // 'metro', 'cab', 'walk'

  const activeHub = useMemo(() => {
    return hubs.find(h => h.id === selectedHubId) || hubs[0];
  }, [hubs, selectedHubId]);

  // Immediately publish active filter on mount
  useEffect(() => {
    if (onFilterChange && activeHub) {
      onFilterChange({
        hub: activeHub,
        maxMinutes,
        mode
      });
    }
  }, [activeHub, maxMinutes, mode, onFilterChange]);

  const handleApply = (hubId, minutes, transitMode) => {
    setSelectedHubId(hubId);
    setMaxMinutes(minutes);
    setMode(transitMode);
  };

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-outline p-6 shadow-sm mb-10 relative overflow-hidden">
      {/* Decorative Warm Accent Gradient */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-terracotta via-amber-500 to-olive"></div>
      
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        
        {/* Left Headline & Overview */}
        <div className="flex flex-col gap-1.5 max-w-md">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-terracotta animate-pulse"></span>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-terracotta">
              Live Commute Radar
            </span>
          </div>
          <h3 className="font-editorial text-2xl font-bold text-primary tracking-tight">
            Door-to-Desk Transit Filter
          </h3>
          <p className="text-xs text-gray-500 font-medium leading-relaxed">
            Filter neighborhood stays by exact metro line travel duration directly to your workplace.
          </p>
        </div>

        {/* Right Interactive Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-grow max-w-3xl">
          
          {/* Destination Hub Selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Workplace / Campus
            </label>
            <div className="relative">
              <select
                value={selectedHubId}
                onChange={(e) => handleApply(e.target.value, maxMinutes, mode)}
                className="w-full bg-sand/60 border border-outline rounded-xl py-2.5 pl-3 pr-8 text-xs font-bold text-primary focus:outline-none focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta transition-all cursor-pointer"
              >
                {hubs.map(hub => (
                  <option key={hub.id} value={hub.id}>
                    {hub.name}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined text-[18px] text-gray-400 absolute right-2.5 top-2.5 pointer-events-none">
                expand_more
              </span>
            </div>
            {activeHub?.metroLine && (
              <span className="text-[9px] text-olive font-bold tracking-wide flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px]">directions_subway</span>
                {activeHub.metroLine}
              </span>
            )}
          </div>

          {/* Transit Mode Selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Transit Mode
            </label>
            <div className="grid grid-cols-3 gap-1 bg-sand/60 p-1 rounded-xl border border-outline">
              <button
                type="button"
                onClick={() => handleApply(selectedHubId, maxMinutes, 'metro')}
                className={`py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  mode === 'metro' 
                    ? 'bg-white text-terracotta shadow-sm' 
                    : 'text-gray-500 hover:text-primary'
                }`}
                title="Metro Rapid Transit"
              >
                <span className="material-symbols-outlined text-[15px]">directions_subway</span>
                <span className="text-[10px]">Metro</span>
              </button>
              <button
                type="button"
                onClick={() => handleApply(selectedHubId, maxMinutes, 'cab')}
                className={`py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  mode === 'cab' 
                    ? 'bg-white text-terracotta shadow-sm' 
                    : 'text-gray-500 hover:text-primary'
                }`}
                title="Cab / Bike Taxi"
              >
                <span className="material-symbols-outlined text-[15px]">local_taxi</span>
                <span className="text-[10px]">Cab</span>
              </button>
              <button
                type="button"
                onClick={() => handleApply(selectedHubId, maxMinutes, 'walk')}
                className={`py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  mode === 'walk' 
                    ? 'bg-white text-terracotta shadow-sm' 
                    : 'text-gray-500 hover:text-primary'
                }`}
                title="Walking Perimeter"
              >
                <span className="material-symbols-outlined text-[15px]">directions_walk</span>
                <span className="text-[10px]">Walk</span>
              </button>
            </div>
            <div className="flex items-center justify-between text-[10px] text-gray-500 font-bold bg-sand/40 px-2.5 py-1.5 rounded-lg border border-outline">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px] text-terracotta">
                  {mode === 'metro' ? 'directions_subway' : mode === 'cab' ? 'local_taxi' : 'directions_walk'}
                </span>
                <span>Avg Speed: {mode === 'metro' ? '32 km/h' : mode === 'cab' ? '24 km/h' : '4.5 km/h'}</span>
              </span>
              <span className="text-terracotta font-extrabold uppercase">
                {mode === 'walk' ? 'Walk perimeter' : mode === 'cab' ? 'Road corridor' : 'Metro transit'}
              </span>
            </div>
          </div>

          {/* Commute Window Slider */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Max Travel Time
              </label>
              <span className="text-xs font-bold text-terracotta bg-sand px-2 py-0.5 rounded-full border border-outline">
                ≤ {maxMinutes} mins
              </span>
            </div>
            <input 
              type="range"
              min="10"
              max="60"
              step="5"
              value={maxMinutes}
              onChange={(e) => handleApply(selectedHubId, Number(e.target.value), mode)}
              className="w-full h-1.5 bg-sand rounded-lg appearance-none cursor-pointer accent-terracotta focus:outline-none mt-2"
            />
            <div className="flex justify-between text-[9px] font-bold text-gray-400">
              <span>10 min</span>
              <span>25 min</span>
              <span>45 min+</span>
            </div>
          </div>

        </div>

      </div>

      {/* Live Calculation Feedback Bar */}
      <div className="mt-5 pt-4 border-t border-outline flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-olive animate-pulse"></span>
          <span className="font-medium text-gray-600">
            Destination: <strong className="text-primary">{activeHub.name}</strong>
          </span>
        </div>
        <div className="flex items-center gap-2 bg-sand/80 px-3.5 py-1.5 rounded-xl border border-outline">
          <span className="material-symbols-outlined text-[16px] text-terracotta">
            {mode === 'metro' ? 'directions_subway' : mode === 'cab' ? 'local_taxi' : 'directions_walk'}
          </span>
          <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
            {mode === 'metro' ? 'Metro Corridor (~32 km/h)' : mode === 'cab' ? 'Cab / Auto (~24 km/h)' : 'Walking Radius (~4.5 km/h)'}
          </span>
          <span className="text-gray-300">•</span>
          <span className="text-xs font-bold text-terracotta">
            ≤ {maxMinutes} mins door-to-desk
          </span>
        </div>
      </div>
    </div>
  );
}
