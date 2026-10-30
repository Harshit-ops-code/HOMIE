'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function CommandPalette({ isOpen, onClose }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  // Quick navigation destinations
  const QUICK_CITIES = [
    { type: 'city', title: 'Delhi NCR Relocation Portal', subtitle: 'Cyber City, Connaught Place, Noida', url: '/delhi', icon: 'account_balance' },
    { type: 'city', title: 'Bengaluru Relocation Portal', subtitle: 'Koramangala, Indiranagar, HSR Layout', url: '/bengaluru', icon: 'park' },
    { type: 'city', title: 'Hyderabad Relocation Portal', subtitle: 'HITEC City, Madhapur, Gachibowli', url: '/hyderabad', icon: 'fort' },
    { type: 'city', title: 'Mumbai Relocation Portal', subtitle: 'BKC, Bandra, Andheri East', url: '/mumbai', icon: 'waves' },
    { type: 'city', title: 'Pune Relocation Portal', subtitle: 'Hinjawadi, Magarpatta, Viman Nagar', url: '/pune', icon: 'landscape' },
  ];

  const QUICK_SERVICES = [
    { type: 'service', title: 'Housing & Co-Living PGs', subtitle: 'Audited broker-free stays', url: '/delhi/housing', icon: 'apartment' },
    { type: 'service', title: 'Home Tiffin & Mess Services', subtitle: 'Monthly meal subscriptions', url: '/delhi/tiffin-mess', icon: 'restaurant' },
    { type: 'service', title: 'Verified Cook & Maid Services', subtitle: 'Background-checked domestic help', url: '/delhi/maid-cook', icon: 'mop' },
    { type: 'service', title: 'Local Sabji Mandi & Groceries', subtitle: 'Neighborhood fresh produce markets', url: '/delhi/sabji-mandi', icon: 'eco' },
  ];

  // Compute the currently active list of selectable items
  const activeItems = query.trim()
    ? results.map(item => ({
        type: 'listing',
        title: item.name,
        subtitle: `${item.locality || 'Local colony'}, ${item.city?.name || 'NCR'}`,
        url: `/${item.city?.slug || 'delhi'}/${item.category?.slug || 'housing'}/${item._id}`,
        price: item.price?.displayText || 'Verified',
        image: item.images?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=120&q=80',
        _id: item._id,
      }))
    : [...QUICK_CITIES, ...QUICK_SERVICES];

  // Listen for Cmd+K / Ctrl+K shortcut to toggle
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onClose(!isOpen);
      }
      if (e.key === 'Escape' && isOpen) {
        onClose(false);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isOpen, onClose]);

  // Focus input and reset selection when modal opens
  useEffect(() => {
    let timer;
    if (isOpen) {
      timer = setTimeout(() => {
        inputRef.current?.focus();
        setSelectedIndex(0);
      }, 30);
    } else {
      timer = setTimeout(() => {
        setQuery('');
        setResults([]);
        setSelectedIndex(0);
      }, 0);
    }
    return () => clearTimeout(timer);
  }, [isOpen]);

  // Query search API when typing (debounced)
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!query.trim()) {
        setResults([]);
        setSelectedIndex(0);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
        const data = await res.json();
        if (data.success && data.listings) {
          setResults(data.listings.slice(0, 8));
          setSelectedIndex(0);
        } else {
          setResults([]);
        }
      } catch (err) {
        console.error('Command palette search error:', err);
      } finally {
        setLoading(false);
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (url) => {
    onClose(false);
    router.push(url);
  };

  // Keyboard navigation within the modal (ArrowUp, ArrowDown, Enter)
  const handleKeyDown = (e) => {
    if (activeItems.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % activeItems.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + activeItems.length) % activeItems.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const selected = activeItems[selectedIndex];
      if (selected?.url) {
        handleSelect(selected.url);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-16 sm:pt-24 px-4 sm:px-6">
      {/* Frosted Backdrop */}
      <div
        onClick={() => onClose(false)}
        className="fixed inset-0 bg-[#2d2621]/45 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
      />

      {/* Modal Dialog */}
      <div 
        onKeyDown={handleKeyDown}
        className="relative w-full max-w-2xl bg-white rounded-3xl border border-[#2d2621]/15 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[82vh]"
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[#2d2621]/[0.08] bg-[#fdfbf7]">
          <span className="material-symbols-outlined text-[22px] text-[#c85a32]">search</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a city, stay, tiffin, or area (e.g. Koramangala, Cyber City)..."
            className="flex-grow bg-transparent text-sm font-semibold text-[#2d2621] outline-none placeholder:text-gray-400"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setResults([]);
              }}
              className="text-gray-400 hover:text-gray-600 material-symbols-outlined text-[18px] cursor-pointer"
            >
              close
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 rounded-md bg-[#2d2621]/5 text-[10px] font-extrabold text-gray-500 border border-[#2d2621]/10">
            ESC
          </kbd>
        </div>

        {/* Results / Navigation Body */}
        <div className="p-4 overflow-y-auto flex-grow flex flex-col gap-5 divide-y divide-[#2d2621]/[0.06]">
          {/* Live Search Results */}
          {query.trim() && (
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#c85a32] px-2 mb-1">
                {loading
                  ? 'Searching verified database...'
                  : results.length > 0
                  ? `Matched Stays & Services (${results.length})`
                  : 'No exact matches found'}
              </span>

              {activeItems.map((item, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                  <div
                    key={item._id || item.url}
                    onClick={() => handleSelect(item.url)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all border ${
                      isSelected
                        ? 'bg-[#f5f0e8] border-[#c85a32]/30 shadow-sm'
                        : 'border-transparent hover:bg-[#f5f0e8]/50'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-[#f5f0e8] border border-[#2d2621]/10 overflow-hidden flex-shrink-0">
                        <img
                          src={item.image}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className={`text-xs font-bold truncate transition-colors ${isSelected ? 'text-[#c85a32]' : 'text-[#2d2621]'}`}>
                          {item.title}
                        </p>
                        <p className="text-[10px] text-gray-400 font-medium truncate">
                          {item.subtitle}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#c85a32] font-editorial flex-shrink-0 pl-2">
                      {item.price}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Quick City Switcher (When input empty) */}
          {!query.trim() && (
            <>
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 px-2">
                  Direct City Portals
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {QUICK_CITIES.map((city, idx) => {
                    const isSelected = idx === selectedIndex;
                    return (
                      <div
                        key={city.url}
                        onClick={() => handleSelect(city.url)}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`flex items-center gap-3 p-2.5 rounded-2xl cursor-pointer transition-all border ${
                          isSelected
                            ? 'bg-[#f5f0e8] border-[#c85a32]/30 shadow-sm'
                            : 'border-transparent hover:bg-[#f5f0e8]/60'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                          isSelected ? 'bg-[#c85a32] text-white' : 'bg-[#c85a32]/10 text-[#c85a32]'
                        }`}>
                          <span className="material-symbols-outlined text-[17px]">{city.icon}</span>
                        </div>
                        <div className="min-w-0">
                          <p className={`text-xs font-bold truncate transition-colors ${isSelected ? 'text-[#c85a32]' : 'text-[#2d2621]'}`}>
                            {city.title}
                          </p>
                          <p className="text-[9px] text-gray-400 truncate">{city.subtitle}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Essential Relocation Utilities */}
              <div className="flex flex-col gap-2 pt-3">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 px-2">
                  Essential Neighborhood Services
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {QUICK_SERVICES.map((srv, sIdx) => {
                    const globalIdx = QUICK_CITIES.length + sIdx;
                    const isSelected = globalIdx === selectedIndex;
                    return (
                      <div
                        key={srv.url}
                        onClick={() => handleSelect(srv.url)}
                        onMouseEnter={() => setSelectedIndex(globalIdx)}
                        className={`flex items-center gap-3 p-2.5 rounded-2xl cursor-pointer transition-all border ${
                          isSelected
                            ? 'bg-[#f5f0e8] border-[#c85a32]/30 shadow-sm'
                            : 'border-transparent hover:bg-[#f5f0e8]/60'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                          isSelected ? 'bg-[#2d2621] text-white' : 'bg-[#2d2621]/10 text-[#2d2621]'
                        }`}>
                          <span className="material-symbols-outlined text-[17px]">{srv.icon}</span>
                        </div>
                        <div className="min-w-0">
                          <p className={`text-xs font-bold truncate transition-colors ${isSelected ? 'text-[#c85a32]' : 'text-[#2d2621]'}`}>
                            {srv.title}
                          </p>
                          <p className="text-[9px] text-gray-400 truncate">{srv.subtitle}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer Hint */}
        <div className="px-5 py-3 bg-[#fdfbf7] border-t border-[#2d2621]/[0.08] flex items-center justify-between text-[10px] font-bold text-gray-400">
          <div className="flex items-center gap-2">
            <span>Navigate:</span>
            <kbd className="px-1.5 py-0.5 rounded bg-white border border-[#2d2621]/15 font-mono">↑↓</kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-white border border-[#2d2621]/15 font-mono">↵ select</kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-white border border-[#2d2621]/15 font-mono">esc close</kbd>
          </div>
          <span className="text-[#c85a32] flex items-center gap-1">
            <span className="material-symbols-outlined text-[12px]">verified</span>
            <span>Verified Relocation Directory</span>
          </span>
        </div>
      </div>
    </div>
  );
}
