'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import AISearchBar from '@/components/ai/AISearchBar';
import AIChatWidget from '@/components/ai/AIChatWidget';
import CommuteRadarWidget from '@/components/relocation/CommuteRadarWidget';
import InteractiveCommuteMap from '@/components/relocation/InteractiveCommuteMap';
import SurvivalKitModal from '@/components/relocation/SurvivalKitModal';
import EditorialListingCard from '@/components/listings/EditorialListingCard';

// Banner slideshow image mappings for our cities
const citySlidesData = {
  bengaluru: [
    'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=80'
  ],
  mumbai: [
    'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1562154055-728904309216?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?auto=format&fit=crop&w=1200&q=80'
  ],
  delhi: [
    '/Delhi/delhi1.jpg',
    '/Delhi/pexels-abdus-samad-mahkri-1624305361-34201914.jpg',
    '/Delhi/pexels-josh-pritam-1176850597-21783045.jpg',
    '/Delhi/pexels-mohit-hambiria-92377455-28678222.jpg',
    '/Delhi/pexels-ravi-roshan-2875998-16931337.jpg',
    '/Delhi/pexels-roman-saienko-1867764487-28672803.jpg'
  ],
  hyderabad: [
    '/hyderabad/pexels-dropshado-11321242.jpg',
    '/hyderabad/pexels-dropshado-33813000.jpg',
    '/hyderabad/pexels-dropshado-4456656.jpg',
    '/hyderabad/pexels-jansher-chakkittammal-230257630-32142811.jpg'
  ],
  pune: [
    '/pune/pexels-ankit-rainloure-1425442-14441811.jpg',
    '/pune/pexels-charlieheng-15623165.jpg'
  ]
};

export default function CityDashboardClient({ cityData, categories, initialListings }) {
  const router = useRouter();
  const [checklist, setChecklist] = useState([]);
  const [activeTab, setActiveTab] = useState('home');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSurvivalKitOpen, setIsSurvivalKitOpen] = useState(false);
  const [commuteFilter, setCommuteFilter] = useState(null);

  const citySlides = useMemo(() => {
    return citySlidesData[cityData.slug] || [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80'
    ];
  }, [cityData.slug]);

  useEffect(() => {
    if (citySlides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % citySlides.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [citySlides]);

  const initializeDefaultChecklist = useCallback(() => {
    const defaultChecklist = [
      { id: 1, text: 'Rent Agreement', completed: true },
      { id: 2, text: 'Gas Connection', completed: false },
      { id: 3, text: 'WiFi Setup', completed: false },
      { id: 4, text: 'Find local tiffin service', completed: false },
      { id: 5, text: 'Hire regular cook/maid', completed: false },
      { id: 6, text: 'Register at nearby gym', completed: false },
      { id: 7, text: 'Locate nearest Metro/Bus stop', completed: false },
      { id: 8, text: 'Find nearest Sabji Mandi', completed: false }
    ];
    setChecklist(defaultChecklist);
    
    // Save to localstorage
    const pref = { city: cityData.slug, checklist: defaultChecklist, onboarded: true };
    localStorage.setItem('basera_preferences', JSON.stringify(pref));
  }, [cityData.slug]);

  // Load checklist state from localStorage on load
  useEffect(() => {
    const saved = localStorage.getItem('basera_preferences');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.checklist) {
          setTimeout(() => {
            setChecklist(parsed.checklist);
          }, 0);
        } else {
          setTimeout(() => {
            initializeDefaultChecklist();
          }, 0);
        }
      } catch (e) {
        setTimeout(() => {
          initializeDefaultChecklist();
        }, 0);
      }
    } else {
      setTimeout(() => {
        initializeDefaultChecklist();
      }, 0);
    }
  }, [initializeDefaultChecklist]);

  const toggleChecklistItem = (id) => {
    const updated = checklist.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    setChecklist(updated);
    
    // Update localStorage
    const saved = localStorage.getItem('basera_preferences');
    if (saved) {
      const parsed = JSON.parse(saved);
      parsed.checklist = updated;
      localStorage.setItem('basera_preferences', JSON.stringify(parsed));
    }
  };

  const completedCount = checklist.filter(i => i.completed).length;
  const totalCount = checklist.length;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  // Filter and annotate listings based on commute radar if active
  const displayedListings = useMemo(() => {
    if (!commuteFilter || !commuteFilter.hub) {
      return initialListings;
    }

    const { hub, maxMinutes, mode } = commuteFilter;
    const speedKmH = mode === 'walk' ? 4.5 : mode === 'cab' ? 24 : 32; // Average metro speed 32km/h incl stops

    const withCommute = initialListings.map(item => {
      if (!item.coordinates?.lat || !item.coordinates?.lng) {
        return { ...item, commuteMins: 20 };
      }
      // Haversine distance
      const R = 6371;
      const dLat = (hub.lat - item.coordinates.lat) * Math.PI / 180;
      const dLon = (hub.lng - item.coordinates.lng) * Math.PI / 180;
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(item.coordinates.lat * Math.PI / 180) * Math.cos(hub.lat * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const distKm = R * c;
      const travelMins = Math.round((distKm / speedKmH) * 60) + (mode === 'metro' ? 6 : 2); // 6 min station access
      return { ...item, commuteMins: travelMins, distanceKm: distKm.toFixed(1) };
    });

    const filtered = withCommute.filter(item => item.commuteMins <= maxMinutes);
    // If filter is too strict, return sorted by closest
    return filtered.length > 0 ? filtered : withCommute.sort((a, b) => a.commuteMins - b.commuteMins);
  }, [initialListings, commuteFilter]);



  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col pb-28 relative bg-pattern">
      {/* Top Navigation Bar */}
      <Navbar />

      {/* Full-width Premium Travel Portal Hero Header */}
      <section className="relative h-[380px] md:h-[480px] w-full overflow-hidden flex flex-col items-center justify-center border-b border-outline-variant/65 shadow-md">
        {/* Background slideshow */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {citySlides.map((url, idx) => (
            <img 
              key={url}
              alt={cityData.name} 
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out ${idx === currentSlide ? 'opacity-100 scale-101 z-0' : 'opacity-0 scale-100 -z-10'}`} 
              src={url}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80';
              }}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/50 to-primary z-10"></div>
        </div>

        {/* Content Inside Hero */}
        <div className="relative z-20 text-center px-4 sm:px-6 max-w-5xl w-full flex flex-col items-center gap-3.5">
          <span className="text-[10px] font-extrabold text-white/90 tracking-widest uppercase bg-black/30 px-3.5 py-1.5 rounded-full backdrop-blur-md border border-white/20 shadow-sm flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[14px] text-terracotta">location_on</span>
            <span>{cityData.name} Relocation Portal</span>
          </span>
          <h2 className="font-editorial text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-none drop-shadow-md">
            Your City. Your Home.
          </h2>
          <p className="text-white/80 text-xs sm:text-sm font-medium tracking-wide">
            Settle in like a local neighbor with verified stays, kitchens, and local services.
          </p>
          <div className="w-full mt-2">
            <AISearchBar city={cityData.slug} />
          </div>

          {/* Breakthrough Stand-out Feature: 48-Hour Survival Kit Button */}
          <div className="flex items-center gap-3 mt-3">
            <button
              type="button"
              onClick={() => setIsSurvivalKitOpen(true)}
              className="bg-terracotta hover:bg-[#b04d29] text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg hover:shadow-xl active:scale-95 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">inventory_2</span>
              <span>Build 48-Hour Survival Kit (Stay + Tiffin + Maid)</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Dashboard */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 w-full mt-10 flex-grow overflow-x-clip">
        
        {/* Background Ambient Blurs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none -z-10">
          <div className="absolute top-0 left-1/4 w-[350px] sm:w-[400px] h-[350px] sm:h-[400px] rounded-full bg-sand/60 aurora-blur select-none pointer-events-none"></div>
          <div className="absolute top-20 right-1/4 w-[400px] sm:w-[500px] h-[400px] sm:h-[500px] rounded-full bg-terracotta/5 aurora-blur select-none pointer-events-none" style={{ animationDuration: '10s' }}></div>
        </div>

        {/* Breakthrough Feature 2: Interactive Commute & Route Simulator with Polyline & Cab Fares */}
        <section className="relative z-10">
          <InteractiveCommuteMap 
            citySlug={cityData.slug} 
            listings={displayedListings}
          />
        </section>

        {/* Checklist Section */}
        {checklist.length > 0 && (
          <section className="mb-10 relative z-10">
            <div className="bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-outline shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-editorial text-xl font-bold text-primary mb-1">
                    New in town? Your Relocation Checklist
                  </h3>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{completedCount} of {totalCount} tasks completed</p>
                </div>
              </div>
              
              <div className="w-full bg-sand h-2 rounded-full overflow-hidden mb-5 border border-outline">
                <div 
                  className="bg-terracotta h-full rounded-full transition-all duration-300 ease-out" 
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
              
              <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2 snap-x w-full max-w-full">
                {checklist.map(item => (
                  <button
                    key={item.id}
                    onClick={() => toggleChecklistItem(item.id)}
                    className={`flex-shrink-0 px-4 py-2.5 rounded-xl border flex items-center gap-2 transition-all active:scale-98 snap-start text-xs font-bold cursor-pointer ${
                      item.completed 
                        ? 'bg-sand border-terracotta/40 text-terracotta' 
                        : 'bg-white border-outline text-gray-600 hover:border-gray-400'
                    }`}
                  >
                    <span className={`material-symbols-outlined text-[18px] ${item.completed ? 'text-terracotta' : 'text-gray-400'}`}>
                      {item.completed ? 'check_box' : 'check_box_outline_blank'}
                    </span>
                    <span>{item.text}</span>
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Category Grid Section */}
        <section className="mb-12 relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex flex-col gap-0.5">
              <h2 className="font-editorial text-2xl font-bold text-primary tracking-tight">Services & Utilities</h2>
              <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">Select category to explore verified options</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            {categories.map(cat => {
              const iconMap = {
                housing: 'home',
                'food-dining': 'restaurant',
                grocery: 'shopping_basket',
                'sabji-mandi': 'eco',
                dairy: 'egg_alt',
                'home-services': 'handyman',
                'tiffin-mess': 'bento',
                'gym-fitness': 'fitness_center',
                'places-to-visit': 'explore',
                'social-fun': 'celebration',
                'maid-cook': 'cleaning_services',
                transport: 'directions_subway'
              };

              const iconName = iconMap[cat.slug] || cat.icon || 'explore';

              return (
                <Link
                  key={cat.slug}
                  href={`/${cityData.slug}/${cat.slug}`}
                  className="group relative overflow-hidden bg-white hover:bg-sand/60 p-3.5 rounded-2xl border border-outline hover:border-terracotta/40 hover:-translate-y-0.5 transition-all active:scale-95 duration-300 flex items-center gap-3 shadow-sm hover:shadow-md"
                >
                  <div className="w-10 h-10 rounded-xl bg-sand/80 border border-outline flex-shrink-0 flex items-center justify-center text-primary group-hover:text-terracotta group-hover:scale-105 transition-all duration-300">
                    <span className="material-symbols-outlined text-[20px]">{iconName}</span>
                  </div>
                  <div className="flex flex-col min-w-0 text-left">
                    <span className="text-xs font-bold text-primary truncate tracking-tight group-hover:text-terracotta transition-colors">{cat.name}</span>
                    <span className="text-[9px] text-gray-400 font-extrabold tracking-widest uppercase">Explore</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Recommended Listings */}
        <section className="mb-12 relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex flex-col gap-0.5">
              <h2 className="font-editorial text-2xl font-bold text-primary tracking-tight">Recommended for you</h2>
              <span className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">Audited & verified neighborhood choices</span>
            </div>
            <Link href={`/${cityData.slug}/housing`} className="text-terracotta hover:underline text-xs font-bold uppercase tracking-wider">
              Explore All
            </Link>
          </div>
          
          <div className="flex gap-6 overflow-x-auto hide-scrollbar pb-4 snap-x w-full max-w-full">
            {displayedListings.length === 0 ? (
              <div className="p-10 text-center bg-white/90 backdrop-blur-md rounded-3xl border border-outline w-full text-xs font-semibold text-gray-400 shadow-sm">
                No listings seeded yet for {cityData.name}.
              </div>
            ) : (
              displayedListings.map(listing => (
                <div key={listing._id} className="flex-shrink-0 w-[300px] snap-start">
                  <EditorialListingCard 
                    listing={listing} 
                    citySlug={cityData.slug} 
                    categorySlug={listing.category?.slug || 'housing'} 
                  />
                </div>
              ))
            )}
          </div>
        </section>

      </main>

      {/* Floating Action Button for Registering Listing */}
      <Link 
        href="/onboard"
        className="fixed right-4 md:right-6 bottom-36 md:bottom-24 w-12 h-12 md:w-13 md:h-13 bg-primary text-white rounded-full shadow-lg flex items-center justify-center active:scale-95 transition-all z-40"
      >
        <span className="material-symbols-outlined text-[22px] md:text-[24px] text-white">add</span>
      </Link>

      {/* Bottom Navigation Bar (Mobile only) */}
      <nav className="fixed bottom-0 left-0 w-full z-50 bg-[#fdfbf7]/95 backdrop-blur-md border-t border-outline pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] md:hidden">
        <div className="flex justify-around items-center px-4 py-3 max-w-md mx-auto">
          <button 
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center justify-center transition-colors duration-200 ${activeTab === 'home' ? 'text-primary' : 'text-gray-400 hover:text-primary'}`}
          >
            <span className="material-symbols-outlined mb-0.5 text-[20px]">home</span>
            <span className="text-[9px] font-bold uppercase tracking-wider">Home</span>
          </button>
          
          <button 
            onClick={() => {
              setActiveTab('explore');
              router.push(`/${cityData.slug}/housing`);
            }}
            className={`flex flex-col items-center justify-center transition-colors duration-200 ${activeTab === 'explore' ? 'text-primary' : 'text-gray-400 hover:text-primary'}`}
          >
            <span className="material-symbols-outlined mb-0.5 text-[20px]">explore</span>
            <span className="text-[9px] font-bold uppercase tracking-wider">Explore</span>
          </button>
          
          <button 
            onClick={() => {
              setActiveTab('saved');
              router.push(`/saved`);
            }}
            className={`flex flex-col items-center justify-center transition-colors duration-200 ${activeTab === 'saved' ? 'text-primary' : 'text-gray-400 hover:text-primary'}`}
          >
            <span className="material-symbols-outlined mb-0.5 text-[20px]">bookmark</span>
            <span className="text-[9px] font-bold uppercase tracking-wider">Saved</span>
          </button>
          
          <button 
            onClick={() => {
              setActiveTab('profile');
              router.push(`/profile`);
            }}
            className={`flex flex-col items-center justify-center transition-colors duration-200 ${activeTab === 'profile' ? 'text-primary' : 'text-gray-400 hover:text-primary'}`}
          >
            <span className="material-symbols-outlined mb-0.5 text-[20px]">person</span>
            <span className="text-[9px] font-bold uppercase tracking-wider">Profile</span>
          </button>
        </div>
      </nav>

      {/* Floating AI assistant widget */}
      <AIChatWidget city={cityData.slug} />

      {/* Standout Relocation 48-Hour Survival Kit Modal */}
      <SurvivalKitModal
        isOpen={isSurvivalKitOpen}
        onClose={() => setIsSurvivalKitOpen(false)}
        cityName={cityData.name}
      />
    </div>
  );
}
