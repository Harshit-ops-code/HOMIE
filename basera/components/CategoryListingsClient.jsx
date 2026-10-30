'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import dynamic from 'next/dynamic';

const GeospatialMap = dynamic(
  () => import('@/components/listings/GeospatialMap'),
  { ssr: false }
);
import EditorialListingCard from '@/components/listings/EditorialListingCard';

export default function CategoryListingsClient({
  cityData,
  categoryData,
  categories = [],
  initialListings,
  subcategories = [],
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [search, setSearch] = useState(initialSearch);
  const [submittedSearch, setSubmittedSearch] = useState(initialSearch);
  const [listings, setListings] = useState(initialListings);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [showMap, setShowMap] = useState(false);
  const [polygonFilter, setPolygonFilter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [selectedCategories, setSelectedCategories] = useState([categoryData.slug]);
  const [selectedSubs, setSelectedSubs] = useState([]);
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  // Lock body scroll and listen for Escape when filter drawer is open
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isFilterOpen) {
        setIsFilterOpen(false);
      }
    };
    if (isFilterOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFilterOpen]);

  const handleSearch = useCallback(async (query, poly = null) => {
    try {
      setLoading(true);
      setSubmittedSearch(query);
      const categoriesParam = selectedCategories.join(',');
      const res = await fetch(
        `/api/listings?city=${cityData.slug}&category=${categoriesParam}&search=${encodeURIComponent(
          query
        )}&polygon=${poly || ''}`
      );

      const data = await res.json();
      if (data.success) {
        setListings(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [cityData.slug, selectedCategories]);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(initialSearch || '', polygonFilter);
    }, 0);
    return () => clearTimeout(timer);
  }, [initialSearch, polygonFilter, handleSearch]);

  const toggleSubcategory = (sub) => {
    setSelectedSubs((prev) =>
      prev.includes(sub) ? prev.filter((s) => s !== sub) : [...prev, sub]
    );
  };

  const filteredListings = listings.filter((item) => {
    if (selectedCategories.length > 0) {
      const itemCatSlug =
        item.category?.slug || (typeof item.category === 'string' ? item.category : '');
      if (!itemCatSlug || !selectedCategories.includes(itemCatSlug)) return false;
    }
    if (item.price?.value && item.price.value > maxPrice) return false;
    if (verifiedOnly && !item.isVerified) return false;
    if (selectedSubs.length > 0 && !selectedSubs.includes(item.subcategory)) return false;
    if (
      search !== submittedSearch &&
      search &&
      !(item.name || '').toLowerCase().includes(search.toLowerCase()) &&
      !(item.description || '').toLowerCase().includes(search.toLowerCase())
    )
      return false;
    return true;
  });

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    handleSearch(search, polygonFilter);
  };

  const clearAllFilters = () => {
    setMaxPrice(100000);
    setVerifiedOnly(false);
    setSelectedSubs([]);
    setSearch('');
    setSubmittedSearch('');
    setSelectedCategories([categoryData.slug]);
    handleSearch('', polygonFilter);
  };

  // Calculate total active filters count
  const activeFiltersCount =
    (maxPrice < 100000 ? 1 : 0) +
    (verifiedOnly ? 1 : 0) +
    selectedSubs.length +
    (search.trim() ? 1 : 0) +
    (selectedCategories.length > 1 || (selectedCategories.length === 1 && selectedCategories[0] !== categoryData.slug) ? 1 : 0);

  const firstListing = filteredListings[0];
  const otherListings = filteredListings.slice(1);

  const handleImageError = (e, item) => {
    e.target.onError = null;
    const catSlug =
      item.category?.slug || (typeof item.category === 'string' ? item.category : '') || 'housing';
    const fallbackImages = {
      housing: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=400&q=80',
      'food-dining': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80',
      'tiffin-mess': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80',
      transport: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=400&q=80',
      'maid-cook': 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=400&q=80',
    };
    e.target.src = fallbackImages[catSlug] || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=400&q=80';
  };

  return (
    <div className="bg-surface text-on-surface font-body-md min-h-screen flex flex-col bg-pattern">
      {/* Global Floating Island Navbar */}
      <Navbar />

      {/* Top Header & Integrated Filter Controls Bar */}
      <div className="bg-white/80 backdrop-blur-md border-b border-[#2d2621]/10 sticky top-[76px] z-30 transition-all shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3">
          
          {/* Left: Back & Category Title */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-[#f5f0e8] hover:bg-[#ebe4d8] text-[#2d2621] transition-all cursor-pointer border border-[#2d2621]/10"
              title="Go Back"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            </button>
            <div>
              <h1 className="font-editorial text-lg sm:text-xl font-bold text-[#2d2621] leading-tight">
                {categoryData.name} in <span className="text-[#c85a32]">{cityData.name}</span>
              </h1>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider hidden sm:block">
                {filteredListings.length} verified listings available
              </p>
            </div>
          </div>

          {/* Right: Quick Search Pill, On-Demand Filters Pill & Map Toggle */}
          <div className="flex items-center gap-2.5 flex-wrap">
            
            {/* Quick Search Input Pill */}
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search stays, areas..."
                className="w-40 sm:w-56 bg-[#f5f0e8]/80 focus:bg-white border border-[#2d2621]/10 rounded-full py-1.5 pl-8 pr-7 text-xs font-medium text-[#2d2621] outline-none focus:ring-2 focus:ring-[#c85a32]/20 transition-all placeholder:text-gray-400"
              />
              <span className="absolute left-2.5 text-gray-400 material-symbols-outlined text-[15px]">search</span>
              {search && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch('');
                    handleSearch('', polygonFilter);
                  }}
                  className="absolute right-2 text-gray-400 hover:text-gray-600 material-symbols-outlined text-[14px]"
                >
                  close
                </button>
              )}
            </form>

            {/* On-Demand Filters Toggle Button */}
            <button
              type="button"
              onClick={() => setIsFilterOpen(true)}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border shadow-sm active:scale-95 ${
                activeFiltersCount > 0
                  ? 'bg-[#2d2621] text-white border-[#2d2621]'
                  : 'bg-white hover:bg-[#f5f0e8] text-[#2d2621] border-[#2d2621]/15'
              }`}
            >
              <span className={`material-symbols-outlined text-[16px] ${activeFiltersCount > 0 ? 'text-[#c85a32]' : 'text-gray-500'}`}>
                tune
              </span>
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#c85a32] text-white text-[10px] font-extrabold flex items-center justify-center font-mono">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* View Mode Toggle: Cards vs Map Split */}
            <button
              type="button"
              onClick={() => setShowMap(!showMap)}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border shadow-sm active:scale-95 ${
                showMap
                  ? 'bg-[#c85a32] text-white border-[#c85a32]'
                  : 'bg-white hover:bg-[#f5f0e8] text-[#2d2621] border-[#2d2621]/15'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">{showMap ? 'grid_view' : 'map'}</span>
              <span className="hidden sm:inline">{showMap ? 'Cards Only' : 'Map Split'}</span>
            </button>

          </div>

        </div>

        {/* Active Filter Chips Bar (Shown when any filter is active) */}
        {activeFiltersCount > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-2.5 pt-0.5 flex items-center gap-2 overflow-x-auto hide-scrollbar">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 whitespace-nowrap">
              Active Filters:
            </span>

            {search.trim() && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#f5f0e8] text-[#2d2621] border border-[#2d2621]/10 whitespace-nowrap">
                <span>&ldquo;{search}&rdquo;</span>
                <button
                  type="button"
                  onClick={() => {
                    setSearch('');
                    handleSearch('', polygonFilter);
                  }}
                  className="hover:text-[#c85a32] material-symbols-outlined text-[13px]"
                >
                  close
                </button>
              </span>
            )}

            {maxPrice < 100000 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#f5f0e8] text-[#2d2621] border border-[#2d2621]/10 whitespace-nowrap">
                <span>Under ₹{maxPrice.toLocaleString('en-IN')}</span>
                <button
                  type="button"
                  onClick={() => setMaxPrice(100000)}
                  className="hover:text-[#c85a32] material-symbols-outlined text-[13px]"
                >
                  close
                </button>
              </span>
            )}

            {verifiedOnly && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#c85a32]/10 text-[#c85a32] border border-[#c85a32]/25 whitespace-nowrap">
                <span className="material-symbols-outlined text-[12px]">verified</span>
                <span>Verified Stays</span>
                <button
                  type="button"
                  onClick={() => setVerifiedOnly(false)}
                  className="hover:text-[#2d2621] material-symbols-outlined text-[13px]"
                >
                  close
                </button>
              </span>
            )}

            {selectedSubs.map((sub) => (
              <span
                key={sub}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#f5f0e8] text-[#2d2621] border border-[#2d2621]/10 whitespace-nowrap"
              >
                <span>{sub}</span>
                <button
                  type="button"
                  onClick={() => toggleSubcategory(sub)}
                  className="hover:text-[#c85a32] material-symbols-outlined text-[13px]"
                >
                  close
                </button>
              </span>
            ))}

            <button
              type="button"
              onClick={clearAllFilters}
              className="text-[11px] font-extrabold text-[#c85a32] hover:underline whitespace-nowrap ml-1 cursor-pointer"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* Main Full-Width Listings & Map Canvas (Zero Wasted Space) */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 w-full py-8 flex-grow">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="bg-white rounded-3xl border border-[#2d2621]/10 overflow-hidden shadow-sm animate-pulse"
              >
                <div className="aspect-[4/3] w-full bg-gray-200"></div>
                <div className="p-5 flex flex-col gap-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                  <div className="h-6 bg-gray-100 rounded w-full mt-2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="p-16 text-center bg-white rounded-3xl border border-[#2d2621]/10 shadow-sm flex flex-col items-center justify-center gap-4 max-w-lg mx-auto mt-8">
            <div className="w-16 h-16 rounded-full bg-[#c85a32]/10 flex items-center justify-center text-[#c85a32]">
              <span className="material-symbols-outlined text-[32px]">search_off</span>
            </div>
            <div>
              <h3 className="font-editorial text-2xl font-bold text-[#2d2621]">No listings matched</h3>
              <p className="text-xs text-gray-500 font-medium mt-1 max-w-sm">
                Try widening your budget slider or clearing subcategory filters to see available verified stays.
              </p>
            </div>
            <button
              type="button"
              onClick={clearAllFilters}
              className="bg-[#c85a32] text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm hover:bg-[#b04d29] transition-all cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className={`flex flex-col ${showMap ? 'lg:flex-row gap-6 items-stretch' : ''} w-full`}>
            {/* Listings Rail */}
            <div className={`flex flex-col gap-8 ${showMap ? 'w-full lg:w-[50%] flex-shrink-0' : 'w-full'}`}>
              
              {/* Featured Listing Hero Card */}
              {firstListing && (
                <div className="relative overflow-hidden rounded-3xl aspect-[16/9] border border-[#2d2621]/15 shadow-md group bg-[#2d2621]">
                  <img
                    alt={firstListing.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-102 transition-transform duration-700 ease-out opacity-90"
                    src={firstListing.images?.[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'}
                    onError={(e) => handleImageError(e, firstListing)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2d2621]/95 via-[#2d2621]/40 to-transparent z-10 pointer-events-none"></div>

                  <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md border border-white/25 text-white px-3 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-widest z-20 shadow-sm">
                    FEATURED AUDITED NODE
                  </div>

                  <div className="absolute bottom-6 left-6 right-6 text-white z-20 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <div>
                      <h3 className="font-editorial text-2xl md:text-3xl font-bold leading-tight text-white drop-shadow-sm">
                        {firstListing.name}
                      </h3>
                      <p className="text-white/85 text-xs font-medium mt-1 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px] text-[#c85a32]">location_on</span>
                        <span>{firstListing.locality}, {cityData.name}</span>
                      </p>
                    </div>
                    <div className="flex flex-col items-start md:items-end flex-shrink-0 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20">
                      <span className="text-[9px] text-gray-300 font-bold uppercase tracking-widest">Pricing</span>
                      <span className="font-editorial text-lg font-bold text-white mt-0.5">
                        {firstListing.price?.displayText || `₹${firstListing.price?.value?.toLocaleString('en-IN')}/mo`}
                      </span>
                    </div>
                  </div>
                  <Link
                    href={`/${cityData.slug}/${categoryData.slug}/${firstListing._id}`}
                    className="absolute inset-0 z-30"
                  ></Link>
                </div>
              )}

              {/* Main Grid of Stays - Full Width (Up to 4 columns when map is closed!) */}
              {otherListings.length > 0 && (
                <div
                  className={`grid grid-cols-1 sm:grid-cols-2 ${
                    showMap ? 'lg:grid-cols-2' : 'lg:grid-cols-3 xl:grid-cols-4'
                  } gap-6`}
                >
                  {otherListings.map((listing) => (
                    <EditorialListingCard
                      key={listing._id}
                      listing={listing}
                      citySlug={cityData.slug}
                      categorySlug={categoryData.slug}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Split Screen Geospatial Map */}
            {showMap && (
              <div className="w-full lg:w-[50%] h-[450px] lg:h-[calc(100vh-140px)] sticky top-[140px] z-20 rounded-3xl overflow-hidden shadow-xl border border-[#2d2621]/15 mt-6 lg:mt-0 bg-white">
                <GeospatialMap
                  listings={filteredListings}
                  cityData={cityData}
                  onPolygonChange={(poly) => setPolygonFilter(poly)}
                />
              </div>
            )}
          </div>
        )}
      </main>

      {/* On-Demand Slide-Over Filter Drawer (Available on Desktop and Mobile) */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Frosted Backdrop */}
          <div
            onClick={() => setIsFilterOpen(false)}
            className="fixed inset-0 bg-[#2d2621]/45 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
          />

          {/* Slide-over Drawer Panel */}
          <aside className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300 border-l border-[#2d2621]/15">
            {/* Drawer Header */}
            <div className="p-6 border-b border-[#2d2621]/10 flex items-center justify-between bg-[#fdfbf7]">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[20px] text-[#c85a32]">tune</span>
                <h3 className="font-editorial text-xl font-bold text-[#2d2621]">
                  Filters & Refinements
                </h3>
                {activeFiltersCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-[#c85a32] text-white text-[10px] font-extrabold flex items-center justify-center font-mono">
                    {activeFiltersCount}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setIsFilterOpen(false)}
                className="w-8 h-8 rounded-full bg-[#f5f0e8] hover:bg-[#ebe4d8] flex items-center justify-center text-[#2d2621] transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Scrollable Filter Controls */}
            <div className="p-6 overflow-y-auto flex-grow flex flex-col gap-6 divide-y divide-[#2d2621]/[0.08]">
              
              {/* Keyword / Area Search */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-gray-500">
                  Search Keyword or Area
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="e.g. Koramangala, balcony, wifi..."
                    className="w-full bg-[#fdfbf7] border border-[#2d2621]/15 rounded-2xl py-3 pl-10 pr-4 text-xs font-semibold text-[#2d2621] outline-none focus:border-[#c85a32] focus:ring-2 focus:ring-[#c85a32]/10 transition-all"
                  />
                  <span className="material-symbols-outlined absolute left-3 top-3 text-[18px] text-gray-400">
                    search
                  </span>
                </div>
              </div>

              {/* Price Range Slider */}
              <div className="pt-5 flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-500">
                    Max Budget
                  </span>
                  <span className="font-editorial text-base font-bold text-[#c85a32]">
                    ₹{maxPrice.toLocaleString('en-IN')}/mo
                  </span>
                </div>
                <input
                  type="range"
                  min="2000"
                  max="100000"
                  step="2000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full h-1.5 bg-[#f5f0e8] rounded-lg appearance-none cursor-pointer accent-[#c85a32]"
                />
                <div className="flex justify-between text-[10px] font-bold text-gray-400">
                  <span>₹2,000</span>
                  <span>₹50,000</span>
                  <span>₹1,00,000+</span>
                </div>
              </div>

              {/* Verified Filter Switch */}
              <div className="pt-5">
                <label className="flex items-center justify-between p-3.5 rounded-2xl bg-[#fdfbf7] border border-[#2d2621]/10 cursor-pointer group hover:border-[#c85a32]/30 transition-all">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#c85a32]/10 text-[#c85a32] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[18px]">verified</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#2d2621]">Verified Stays Only</p>
                      <p className="text-[10px] text-gray-400">Inspected agreements & photos</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={verifiedOnly}
                    onChange={() => setVerifiedOnly(!verifiedOnly)}
                    className="w-5 h-5 rounded-lg text-[#c85a32] focus:ring-[#c85a32] border-[#2d2621]/20 cursor-pointer"
                  />
                </label>
              </div>

              {/* Subcategories Checklist */}
              {subcategories.length > 0 && (
                <div className="pt-5 flex flex-col gap-3">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-500">
                    Subcategory Types
                  </span>
                  <div className="grid grid-cols-1 gap-2">
                    {subcategories.map((sub) => {
                      const isChecked = selectedSubs.includes(sub);
                      return (
                        <label
                          key={sub}
                          className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${
                            isChecked
                              ? 'bg-[#c85a32]/10 border-[#c85a32]/30 text-[#2d2621]'
                              : 'bg-white border-[#2d2621]/10 hover:bg-[#f5f0e8] text-gray-600'
                          }`}
                        >
                          <span className="text-xs font-semibold">{sub}</span>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleSubcategory(sub)}
                            className="w-4 h-4 rounded text-[#c85a32] focus:ring-[#c85a32] border-gray-300 cursor-pointer"
                          />
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Categories Refinement */}
              {categories.length > 0 && (
                <div className="pt-5 flex flex-col gap-3">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-500">
                    Cross-Category Inclusion
                  </span>
                  <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
                    {categories.map((cat) => {
                      const isChecked = selectedCategories.includes(cat.slug);
                      return (
                        <label
                          key={cat.slug}
                          className="flex items-center gap-3 text-xs font-medium text-gray-700 cursor-pointer group"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              setSelectedCategories((prev) =>
                                prev.includes(cat.slug)
                                  ? prev.filter((s) => s !== cat.slug)
                                  : [...prev, cat.slug]
                              );
                            }}
                            className="rounded border-[#2d2621]/20 text-[#c85a32] focus:ring-[#c85a32] h-4 w-4"
                          />
                          <span className="flex items-center gap-2 group-hover:text-[#c85a32] transition-colors">
                            <span className="material-symbols-outlined text-[16px] text-gray-400 group-hover:text-[#c85a32]">
                              {cat.icon || 'explore'}
                            </span>
                            <span>{cat.name}</span>
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>

            {/* Drawer Footer Actions */}
            <div className="p-5 border-t border-[#2d2621]/10 bg-[#fdfbf7] flex items-center gap-3">
              <button
                type="button"
                onClick={clearAllFilters}
                className="w-1/3 py-3 rounded-full text-xs font-bold text-gray-600 hover:text-[#2d2621] uppercase tracking-wider text-center transition-colors cursor-pointer border border-[#2d2621]/10 bg-white"
              >
                Reset All
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsFilterOpen(false);
                  handleSearch(search, polygonFilter);
                }}
                className="flex-1 py-3 rounded-full text-xs font-extrabold uppercase tracking-wider bg-[#c85a32] hover:bg-[#b04d29] text-white shadow-md active:scale-95 transition-all text-center cursor-pointer"
              >
                Show {filteredListings.length} Results
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
