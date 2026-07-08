'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';

// Dynamically import LeafletMap client component to disable Server-Side Rendering (SSR)
const LeafletMap = dynamic(
  () => import('@/components/LeafletMap'),
  { ssr: false }
);

export default function MapPageClient({ listing, city, category, id }) {
  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col relative">
      {/* Header bar overlay */}
      <header className="absolute top-4 left-4 right-4 z-50 flex justify-between items-center">
        <Link 
          href={`/${city}/${category}/${id}`} 
          className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary shadow-md hover:bg-gray-50 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-[24px]">arrow_back</span>
        </Link>
        <div className="bg-white/90 backdrop-blur-md px-6 py-2 rounded-full border border-outline-variant/30 shadow-md font-quicksand text-sm font-bold text-primary">
          Map View
        </div>
        <div className="w-10"></div> {/* Spacer balance */}
      </header>

      {/* Map Content View Canvas */}
      <div className="flex-grow w-full h-[calc(100vh-140px)] relative z-10">
        <LeafletMap 
          coordinates={listing.coordinates} 
          title={listing.name}
          address={listing.address}
        />
      </div>

      {/* Dynamic bottom details drawer sheet */}
      <div className="absolute bottom-6 left-4 right-4 z-55 bg-white/95 backdrop-blur-md p-5 rounded-card border border-outline-variant/30 shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 max-w-2xl mx-auto">
        <div>
          <h3 className="font-quicksand text-lg font-bold text-primary mb-1">{listing.name}</h3>
          <p className="text-xs font-semibold text-gray-500 flex items-center gap-0.5">
            <span className="material-symbols-outlined text-[16px] text-secondary font-variation-settings: 'FILL' 1">location_on</span>
            {listing.address}
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <a 
            href={`https://www.google.com/maps/dir/?api=1&destination=${listing.coordinates.lat},${listing.coordinates.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-grow sm:flex-grow-0 px-6 py-3 bg-secondary text-on-secondary rounded-full font-bold text-xs shadow-sm flex items-center justify-center gap-1 active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-[16px]">navigation</span>
            Get Directions
          </a>
        </div>
      </div>
    </div>
  );
}
