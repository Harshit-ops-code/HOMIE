'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';

// Dynamically import LeafletMap client component to disable Server-Side Rendering (SSR)
const LeafletMap = dynamic(
  () => import('@/components/LeafletMap'),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-slate-950 text-slate-400 font-plus-jakarta text-sm">
        <div className="flex flex-col items-center gap-3">
          <span className="material-symbols-outlined text-4xl animate-spin text-primary-400">progress_activity</span>
          <span className="tracking-wide uppercase text-xs font-bold text-slate-400">Loading Geospatial Engine...</span>
        </div>
      </div>
    )
  }
);

export default function MapPageClient({ listing, city, category, id }) {
  const coordinates = listing?.coordinates || { lat: 12.9716, lng: 77.5946 };

  return (
    <div className="bg-slate-950 text-white min-h-screen flex flex-col relative overflow-hidden">
      {/* Top Header Floating Navigation Bar */}
      <header className="absolute top-4 left-4 right-4 z-40 flex justify-between items-center pointer-events-auto">
        <Link 
          href={`/${city}/${category}/${id}`} 
          className="w-11 h-11 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white shadow-xl hover:bg-slate-800 active:scale-95 transition-all"
          title="Back to Details"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </Link>
        <div className="bg-slate-900/90 backdrop-blur-xl px-5 py-2.5 rounded-2xl border border-white/10 shadow-xl font-plus-jakarta text-xs font-bold tracking-wider uppercase text-white flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Tactical Map &bull; {listing.name || 'Location'}</span>
        </div>
        <div className="w-11"></div>
      </header>

      {/* Full Canvas Interactive Map */}
      <main className="flex-grow w-full h-[calc(100vh-120px)] relative z-10">
        <LeafletMap 
          coordinates={coordinates} 
          title={listing.name}
          address={listing.address}
          category={category}
        />
      </main>

      {/* Floating Bottom Card Drawer */}
      <aside className="absolute bottom-6 left-4 right-4 z-40 bg-slate-900/95 backdrop-blur-xl p-5 rounded-2xl border border-white/10 shadow-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 max-w-2xl mx-auto w-full">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary-500/20 text-primary-300 border border-primary-500/30">
              Verified Pin
            </span>
            <span className="text-xs text-slate-400 font-semibold">{city?.toUpperCase()}</span>
          </div>
          <h3 className="font-plus-jakarta text-base sm:text-lg font-extrabold text-white truncate">{listing.name}</h3>
          <p className="text-xs font-medium text-slate-300 flex items-center gap-1 mt-1 truncate">
            <span className="material-symbols-outlined text-[15px] text-primary-400">location_on</span>
            <span className="truncate">{listing.address}</span>
          </p>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto flex-shrink-0">
          <a 
            href={`https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-grow sm:flex-grow-0 px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold text-xs shadow-lg shadow-primary-600/30 flex items-center justify-center gap-1.5 active:scale-95 transition-all min-h-[44px]"
          >
            <span className="material-symbols-outlined text-[18px]">navigation</span>
            Get Directions
          </a>
        </div>
      </aside>
    </div>
  );
}
