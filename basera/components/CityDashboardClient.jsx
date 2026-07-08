'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import AISearchBar from '@/components/ai/AISearchBar';
import AIChatWidget from '@/components/ai/AIChatWidget';

export default function CityDashboardClient({ cityData, categories, initialListings }) {
  const router = useRouter();
  const [checklist, setChecklist] = useState([]);
  const [activeTab, setActiveTab] = useState('home');
  const [currentSlide, setCurrentSlide] = useState(0);

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

  const citySlides = citySlidesData[cityData.slug] || [
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80'
  ];

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



  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col pb-28 relative bg-pattern">
      {/* Top Navigation Bar */}
      <Navbar />

      {/* Full-width Premium Travel Portal Hero Header */}
      <section className="relative h-[300px] w-full overflow-hidden flex flex-col items-center justify-center border-b border-outline-variant/65 shadow-md">
        {/* Background slideshow */}
        <div className="absolute inset-0 z-0">
          {citySlides.map((url, idx) => (
            <img 
              key={url}
              alt={cityData.name} 
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out ${idx === currentSlide ? 'opacity-100 scale-101 z-0' : 'opacity-0 scale-100 -z-10'}`} 
              src={url}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/50 to-primary z-10"></div>
        </div>

        {/* Content Inside Hero */}
        <div className="relative z-20 text-center px-6 max-w-2xl w-full flex flex-col items-center gap-3.5">
          <span className="text-[9px] font-extrabold text-white/80 tracking-widest uppercase bg-white/10 px-3.5 py-1.5 rounded-xl backdrop-blur-md border border-white/20 shadow-sm">
            📍 {cityData.name} Portal
          </span>
          <h2 className="font-plus-jakarta text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-none drop-shadow-md">
            Your City. Your Home.
          </h2>
          <p className="text-white/75 text-xs font-semibold uppercase tracking-wider">
            Settle in like a local neighbor.
          </p>
          <div className="w-full mt-2">
            <AISearchBar city={cityData.slug} />
          </div>
        </div>
      </section>

      {/* Main Content Dashboard */}
      <main className="max-w-max-width-desktop mx-auto px-6 w-full mt-10 flex-grow">
        
        {/* Background Aurora Blurs */}
        <div className="absolute top-0 left-1/4 w-[400px] h-[400px] rounded-full bg-purple-200/25 aurora-blur select-none pointer-events-none"></div>
        <div className="absolute top-20 right-1/4 w-[500px] h-[500px] rounded-full bg-amber-100/20 aurora-blur select-none pointer-events-none animate-pulse" style={{ animationDuration: '10s' }}></div>

        {/* Checklist Section */}
        {checklist.length > 0 && (
          <section className="mb-10 relative z-10">
            <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-outline/80 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-plus-jakarta text-lg font-bold text-primary mb-1">
                    New in town? Your Checklist
                  </h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{completedCount} of {totalCount} tasks completed</p>
                </div>
              </div>
              
              <div className="w-full bg-gray-150 h-2 rounded-full overflow-hidden mb-5 border border-outline/20">
                <div 
                  className="bg-primary h-full rounded-full transition-all duration-300 ease-out" 
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
              
              <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2 snap-x">
                {checklist.map(item => (
                  <button
                    key={item.id}
                    onClick={() => toggleChecklistItem(item.id)}
                    className={`flex-shrink-0 px-4 py-2.5 rounded-xl border flex items-center gap-2 transition-all active:scale-98 snap-start text-xs font-bold ${
                      item.completed 
                        ? 'bg-gray-100 border-primary text-primary' 
                        : 'bg-white border-outline text-gray-500 hover:border-gray-400'
                    }`}
                  >
                    <span className={`material-symbols-outlined text-[18px] ${item.completed ? 'text-primary' : 'text-gray-400'}`}>
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
              <h2 className="font-plus-jakarta text-xl font-bold text-primary tracking-tight">Services & Utilities</h2>
              <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">Select category to explore</span>
            </div>
          </div>
          
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map(cat => {
              const iconMap = {
                housing: '🏠',
                'food-dining': '🍽️',
                grocery: '🛒',
                'sabji-mandi': '🥦',
                dairy: '🥛',
                'home-services': '🔧',
                'tiffin-mess': '🍱',
                'gym-fitness': '💪',
                'places-to-visit': '🗺️',
                'social-fun': '🎯',
                'maid-cook': '🧹',
                transport: '🚌'
              };

              const colorsMap = {
                housing: 'from-blue-50 to-indigo-50 border-indigo-100 hover:shadow-indigo-100/50 text-indigo-600',
                'food-dining': 'from-orange-50 to-amber-50 border-orange-100 hover:shadow-orange-100/50 text-orange-600',
                grocery: 'from-green-50 to-emerald-50 border-green-100 hover:shadow-green-100/50 text-green-600',
                'sabji-mandi': 'from-lime-50 to-emerald-50 border-lime-100 hover:shadow-lime-100/50 text-lime-600',
                dairy: 'from-sky-50 to-blue-50 border-sky-100 hover:shadow-sky-100/50 text-sky-600',
                'home-services': 'from-amber-50 to-yellow-50 border-amber-100 hover:shadow-amber-100/50 text-amber-600',
                'tiffin-mess': 'from-red-50 to-orange-50 border-red-100 hover:shadow-red-100/50 text-red-600',
                'gym-fitness': 'from-purple-50 to-fuchsia-50 border-purple-100 hover:shadow-purple-100/50 text-purple-600',
                'places-to-visit': 'from-emerald-50 to-teal-50 border-emerald-100 hover:shadow-emerald-100/50 text-emerald-600',
                'social-fun': 'from-pink-50 to-rose-50 border-pink-100 hover:shadow-pink-100/50 text-pink-600',
                'maid-cook': 'from-teal-50 to-cyan-50 border-teal-100 hover:shadow-teal-100/50 text-teal-600',
                transport: 'from-slate-50 to-zinc-50 border-slate-100 hover:shadow-slate-100/50 text-slate-600'
              };

              const themeClass = colorsMap[cat.slug] || 'from-gray-50 to-slate-50 border-gray-100 hover:shadow-gray-100/50 text-gray-600';

              return (
                <Link
                  key={cat.slug}
                  href={`/${cityData.slug}/${cat.slug}`}
                  className={`group relative overflow-hidden bg-gradient-to-br ${themeClass} p-5 rounded-2xl border hover:border-current hover:-translate-y-1 transition-all active:scale-95 duration-300 flex flex-col items-center justify-center aspect-square shadow-sm hover:shadow-lg`}
                >
                  <div className="absolute top-0 right-0 w-16 h-16 bg-white/20 rounded-bl-full translate-x-3 -translate-y-3 group-hover:scale-110 transition-transform duration-300"></div>
                  <div className="w-13 h-13 rounded-full bg-white/95 shadow-sm border border-inherit flex items-center justify-center text-2xl mb-3.5 group-hover:rotate-6 transition-transform duration-300">
                    {iconMap[cat.slug] || cat.icon || '🏷️'}
                  </div>
                  <span className="text-[11px] font-extrabold text-primary text-center truncate w-full tracking-tight">{cat.name}</span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Recommended Listings */}
        <section className="mb-12 relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex flex-col gap-0.5">
              <h2 className="font-plus-jakarta text-xl font-bold text-primary tracking-tight">Recommended for you</h2>
              <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">Top verified choices</span>
            </div>
            <Link href={`/${cityData.slug}/housing`} className="text-primary hover:underline text-xs font-bold uppercase tracking-wider">
              Explore All
            </Link>
          </div>
          
          <div className="flex gap-6 overflow-x-auto hide-scrollbar pb-4 snap-x">
            {initialListings.length === 0 ? (
              <div className="p-10 text-center bg-white/80 backdrop-blur-md rounded-3xl border border-outline w-full text-xs font-semibold text-gray-400 shadow-sm">
                No listings seeded yet for {cityData.name}.
              </div>
            ) : (
              initialListings.map(listing => (
                <Link
                  key={listing._id}
                  href={`/${cityData.slug}/${listing.category?.slug || 'housing'}/${listing._id}`}
                  className="flex-shrink-0 w-[270px] snap-start bg-white rounded-3xl border border-outline/80 overflow-hidden shadow-sm hover:shadow-md hover:border-primary/25 transition-all duration-300 group"
                >
                  <div className="h-44 w-full relative overflow-hidden">
                    <img 
                      alt={listing.name} 
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 ease-out" 
                      src={listing.images?.[0] || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=400&q=80'}
                    />
                    {listing.isVerified && (
                      <span className="absolute top-3.5 left-3.5 bg-primary/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                        <span className="material-symbols-outlined text-[10px]">verified</span>
                        Verified
                      </span>
                    )}
                  </div>
                  <div className="p-5">
                    <h4 className="font-bold text-sm text-primary truncate leading-snug group-hover:text-primary/80 transition-colors">{listing.name}</h4>
                    <p className="text-gray-400 text-xs font-semibold mt-1 flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[12px] text-gray-300">location_on</span>
                      {listing.locality || 'Local area'}
                    </p>
                    <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
                      <span className="text-xs font-bold text-primary">
                        {listing.price?.displayText || `₹${listing.price?.value?.toLocaleString('en-IN')}`}
                      </span>
                      <div className="flex items-center gap-0.5 text-gray-600 font-bold text-xs">
                        <span className="material-symbols-outlined text-[12px] text-yellow-500">star</span>
                        <span>{listing.rating?.average || 4.2}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </section>

      </main>

      {/* Floating Action Button for Registering Listing */}
      <Link 
        href="/onboard"
        className="fixed right-6 bottom-24 w-13 h-13 bg-primary text-white rounded-full shadow-md flex items-center justify-center active:scale-95 transition-all z-40"
      >
        <span className="material-symbols-outlined text-[24px] text-white">add</span>
      </Link>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 w-full z-50 bg-white/95 border-t border-outline-variant/60 pb-safe">
        <div className="flex justify-around items-center px-4 py-3.5 max-w-md mx-auto">
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
    </div>
  );
}
