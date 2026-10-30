'use client';

import { useState } from 'react';
import Link from 'next/link';

// Curated collections of unique, high-resolution lifestyle & architectural photography
const CURATED_PHOTO_POOLS = {
  housing: [
    [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80'
    ],
    [
      'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80'
    ],
    [
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80'
    ],
    [
      'https://images.unsplash.com/photo-1502005229762-ee1b2b8ab326?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1540518614846-7ede433c4b13?auto=format&fit=crop&w=800&q=80'
    ],
    [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1499916078039-922301b0eb9b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80'
    ],
    [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80'
    ]
  ],
  'food-dining': [
    [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=80'
    ],
    [
      'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80'
    ],
    [
      'https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80'
    ],
    [
      'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=800&q=80'
    ],
    [
      'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1579684947550-22e945225d9a?auto=format&fit=crop&w=800&q=80'
    ],
    [
      'https://images.unsplash.com/photo-1508424757105-b6d5ad9329d0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80'
    ]
  ],
  default: [
    [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80'
    ],
    [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'
    ],
    [
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80'
    ]
  ]
};

// Deterministic string hasher to distribute distinct photos consistently
function getDeterministicIndex(str = '', max = 6) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % max;
}

export default function EditorialListingCard({ listing, citySlug, categorySlug }) {
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  const catKey = (listing.category?.slug || categorySlug || 'housing').toLowerCase();
  const pool = CURATED_PHOTO_POOLS[catKey] || CURATED_PHOTO_POOLS.housing;
  
  // Pick distinct photo set based on the listing unique ID and name
  const photoIndex = getDeterministicIndex((listing._id || listing.name || 'basera').toString(), pool.length);
  const fallbackList = pool[photoIndex] || pool[0];

  // Filter out broken Google streetview and expired lh3 temporary links
  const validImages = (listing.images || []).filter(url => 
    url && 
    !url.includes('lh3.googleusercontent.com') && 
    !url.includes('streetviewpixels-pa.googleapis.com') &&
    url.startsWith('http')
  );

  const images = validImages.length > 0 ? validImages : fallbackList;

  const categoryName = listing.category?.name || categorySlug || 'Stay';
  const targetCategorySlug = listing.category?.slug || categorySlug || 'housing';

  const handlePrevImg = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveImgIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImg = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveImgIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const toggleSave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSaved(!isSaved);
  };

  return (
    <div className="group relative flex flex-col bg-white rounded-[24px] border border-[#2d2621]/[0.08] hover:border-[#c85a32]/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_-12px_rgba(45,38,33,0.08)] overflow-hidden">
      
      {/* Visual Image Showcase with Micro-Gallery Slider & Frosted Badges */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#f5f0e8] select-none">
        <Link href={`/${citySlug}/${targetCategorySlug}/${listing._id}`} className="block w-full h-full">
          <img
            src={images[activeImgIndex]}
            alt={listing.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80';
            }}
          />
        </Link>

        {/* Soft Vignette Overlay for Crisp Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none"></div>

        {/* Top Badges Row */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10 pointer-events-none">
          <div className="flex items-center gap-1.5 flex-wrap">
            {listing.isVerified && (
              <span className="backdrop-blur-md bg-[#2d2621]/80 text-[#fdfbf7] px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-widest flex items-center gap-1 shadow-sm border border-white/10">
                <span className="material-symbols-outlined text-[12px] text-[#c85a32]">verified</span>
                <span>Verified</span>
              </span>
            )}
            {listing.subcategory && (
              <span className="backdrop-blur-md bg-white/80 text-[#2d2621] px-2.5 py-1 rounded-full text-[9px] font-bold tracking-wider uppercase border border-[#2d2621]/10">
                {listing.subcategory}
              </span>
            )}
          </div>

          {/* Bookmark Action Button */}
          <button
            type="button"
            onClick={toggleSave}
            aria-label="Save listing"
            className="pointer-events-auto w-8 h-8 rounded-full backdrop-blur-md bg-white/80 hover:bg-white text-[#2d2621] hover:text-[#c85a32] flex items-center justify-center transition-all active:scale-90 shadow-sm border border-white/20 cursor-pointer"
          >
            <span
              className="material-symbols-outlined text-[17px]"
              style={{
                fontVariationSettings: isSaved ? "'FILL' 1" : "'FILL' 0",
                color: isSaved ? '#c85a32' : undefined
              }}
            >
              favorite
            </span>
          </button>
        </div>

        {/* Multi-Image Quick Navigation Chevrons (Only if multiple photos) */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrevImg}
              aria-label="Previous photo"
              className="opacity-0 group-hover:opacity-100 transition-opacity absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full backdrop-blur-md bg-white/80 hover:bg-white text-[#2d2621] flex items-center justify-center shadow-md border border-white/20 active:scale-95 cursor-pointer z-10"
            >
              <span className="material-symbols-outlined text-[16px]">chevron_left</span>
            </button>
            <button
              type="button"
              onClick={handleNextImg}
              aria-label="Next photo"
              className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full backdrop-blur-md bg-white/80 hover:bg-white text-[#2d2621] flex items-center justify-center shadow-md border border-white/20 active:scale-95 cursor-pointer z-10"
            >
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>

            {/* Micro Dot Pagination */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1 z-10 pointer-events-none">
              {images.slice(0, 5).map((_, idx) => (
                <span
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === activeImgIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Live Commute Badge (if commute metrics are active) */}
        {listing.commuteMins !== undefined && (
          <div className="absolute bottom-3 left-3 z-10 pointer-events-none">
            <span className="backdrop-blur-md bg-[#c85a32]/90 text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide flex items-center gap-1 shadow-sm">
              <span className="material-symbols-outlined text-[12px]">directions_subway</span>
              <span>{listing.commuteMins} min to office</span>
            </span>
          </div>
        )}
      </div>

      {/* Editorial Content Card Body */}
      <div className="p-5 flex flex-col flex-grow justify-between gap-3 bg-white">
        
        <div>
          {/* Header Row: Title & Rating */}
          <div className="flex items-start justify-between gap-2">
            <Link href={`/${citySlug}/${targetCategorySlug}/${listing._id}`} className="min-w-0">
              <h3 className="font-editorial text-[17px] font-bold text-[#2d2621] truncate leading-tight group-hover:text-[#c85a32] transition-colors">
                {listing.name}
              </h3>
            </Link>
            <div className="flex items-center gap-1 text-[11px] font-extrabold text-[#2d2621] bg-[#f5f0e8] px-2 py-0.5 rounded-full flex-shrink-0 border border-[#2d2621]/[0.06]">
              <span className="material-symbols-outlined text-[13px] text-amber-600">star</span>
              <span>{listing.rating?.average?.toFixed(1) || '4.2'}</span>
            </div>
          </div>

          {/* Location & Neighborhood Vibe Tag */}
          <p className="text-xs text-gray-500 font-medium mt-1 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] text-[#c85a32]">location_on</span>
            <span className="truncate">{listing.locality || 'Prime Locality'}, {citySlug?.toUpperCase()}</span>
          </p>

          {/* AI Match Verdict or Curated Feature Tag */}
          {listing.aiMatchReason ? (
            <div className="mt-2 text-[10px] text-[#5b6951] bg-[#5b6951]/10 px-2 py-1 rounded-lg border border-[#5b6951]/20 line-clamp-1 italic font-semibold">
              &ldquo;{listing.aiMatchReason}&rdquo;
            </div>
          ) : listing.amenities && listing.amenities.length > 0 ? (
            <div className="mt-2.5 flex items-center gap-1.5 overflow-hidden text-[10px] text-gray-500 font-medium">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#5b6951]/60"></span>
              <span className="truncate">{listing.amenities.slice(0, 3).join(' • ')}</span>
            </div>
          ) : null}
        </div>

        {/* Pricing & Direct Inspect Action */}
        <div className="pt-3 border-t border-[#2d2621]/[0.06] flex items-center justify-between mt-auto">
          <div>
            <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400 block">Monthly Rate</span>
            <span className="font-editorial text-[15px] font-bold text-[#c85a32]">
              {listing.price?.displayText || (listing.price?.value ? `₹${listing.price.value.toLocaleString('en-IN')}/mo` : '₹12,000 – ₹18,000/mo')}
            </span>
          </div>

          <Link
            href={`/${citySlug}/${targetCategorySlug}/${listing._id}`}
            className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-xl bg-[#f5f0e8] hover:bg-[#2d2621] text-[#2d2621] hover:text-white transition-all duration-200 flex items-center gap-1 group/btn"
          >
            <span>Inspect</span>
            <span className="material-symbols-outlined text-[13px] group-hover/btn:translate-x-0.5 transition-transform">arrow_forward</span>
          </Link>
        </div>

      </div>

    </div>
  );
}
