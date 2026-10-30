'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const CITY_PROFILES = {
  delhi: {
    name: 'Delhi NCR',
    slug: 'delhi',
    tag: 'Heart of the Nation',
    vibe: 'Historic Grandeur, Metro Corridors & Culinary Heritage',
    weather: '26°C Sunny',
    aqi: 'AQI 86 Moderate',
    corridors: 'Rapid Metro & Yellow Line',
    stat: '1,200+ Verified Nodes',
    image: '/Delhi/delhi1.jpg',
    images: [
      {
        url: '/Delhi/delhi1.jpg',
        caption: 'Rashtrapati Bhavan & Kartavya Path',
      },
      {
        url: '/Delhi/pexels-abdus-samad-mahkri-1624305361-34201914.jpg',
        caption: 'Red Fort (Lal Qila) Historic Ramparts',
      },
      {
        url: '/Delhi/pexels-ravi-roshan-2875998-16931337.jpg',
        caption: "Humayun's Tomb Heritage Grounds",
      },
      {
        url: '/Delhi/pexels-josh-pritam-1176850597-21783045.jpg',
        caption: 'Qutub Minar Historical Complex',
      },
      {
        url: '/Delhi/pexels-mohit-hambiria-92377455-28678222.jpg',
        caption: 'Old Delhi & Jama Masjid Cityscape',
      },
      {
        url: '/Delhi/pexels-roman-saienko-1867764487-28672803.jpg',
        caption: 'Chandni Chowk Cultural Bazaar',
      },
    ],
    rentIndex: '₹12,000 – ₹20,000/mo',
    tiffinIndex: '₹2,600 – ₹3,400/mo',
    depositNorm: '1-2 Months (Broker-Free)',
    hubs: ['Cyber City', 'Hauz Khas', 'Noida Sec 62', 'Saket'],
    teaserListings: [
      {
        id: 'delhi-teaser-1',
        name: 'The Athena Co-Living Residency',
        locality: 'DLF Phase 3, Gurgaon',
        tag: 'Co-living PG • Rapid Metro Walk',
        rate: '₹16,500/mo',
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80',
        url: '/delhi/housing',
      },
      {
        id: 'delhi-teaser-2',
        name: 'Darjeeling Restaurant & Momos',
        locality: 'Safdarjung Enclave',
        tag: 'Authentic Himalayan Home Dining',
        rate: '₹350 for two',
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
        url: '/delhi/food-dining',
      },
    ],
  },
  bengaluru: {
    name: 'Bengaluru',
    slug: 'bengaluru',
    tag: 'Silicon Valley of India',
    vibe: 'Tech Hubs, Startups, Tree-Lined Avenues & Craft Brews',
    weather: '22°C Pleasant',
    aqi: 'AQI 42 Clean',
    corridors: 'Purple Line & ORR Shuttle',
    stat: '2,400+ Verified Nodes',
    image: '/benguluru/pexels-akhil-dasari-2160057282-36817688.jpg',
    images: [
      {
        url: '/benguluru/pexels-akhil-dasari-2160057282-36817688.jpg',
        caption: 'Vidhana Soudha Illuminated at Night',
      },
      {
        url: '/benguluru/pexels-akhil-dasari-2160057282-36817664.jpg',
        caption: 'Vidhana Soudha Neo-Dravidian Architecture',
      },
      {
        url: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1600&q=80',
        caption: 'UB City & Bengaluru CBD Tech Corridor',
      },
      {
        url: 'https://images.unsplash.com/photo-1588416936097-41850ab3d86d?auto=format&fit=crop&w=1600&q=80',
        caption: 'Cubbon Park Historic Botanical Canopy',
      },
    ],
    rentIndex: '₹14,500 – ₹24,000/mo',
    tiffinIndex: '₹2,800 – ₹3,800/mo',
    depositNorm: '2-3 Months (Verified Standard)',
    hubs: ['Koramangala', 'HSR Layout', 'Indiranagar', 'Whitefield'],
    teaserListings: [
      {
        id: 'blr-teaser-1',
        name: 'Stanza Living - Lorient House',
        locality: 'Koramangala 4th Block',
        tag: 'Managed Co-living • High-speed WiFi',
        rate: '₹14,500/mo',
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80',
        url: '/bengaluru/housing',
      },
      {
        id: 'blr-teaser-2',
        name: 'South Tiffin Home Kitchen',
        locality: 'HSR Layout Sector 1',
        tag: 'Pure Veg Homemade Thali & Dosa',
        rate: '₹2,800/mo',
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
        url: '/bengaluru/tiffin-mess',
      },
    ],
  },
  hyderabad: {
    name: 'Hyderabad',
    slug: 'hyderabad',
    tag: 'Cyberabad & Pearls',
    vibe: 'HITEC City, IT Parks, Modern Glass Towers & Biryani Culture',
    weather: '28°C Warm',
    aqi: 'AQI 68 Moderate',
    corridors: 'Blue & Red Line Metro',
    stat: '980+ Verified Nodes',
    image: '/hyderabad/pexels-dropshado-11321242.jpg',
    images: [
      {
        url: '/hyderabad/pexels-dropshado-11321242.jpg',
        caption: 'Charminar Historic Old City',
      },
      {
        url: '/hyderabad/pexels-dropshado-33813000.jpg',
        caption: 'Charminar Minarets & Festive Old City',
      },
      {
        url: '/hyderabad/pexels-dropshado-4456656.jpg',
        caption: 'HITEC City & Gachibowli Modern Towers',
      },
      {
        url: '/hyderabad/pexels-jansher-chakkittammal-230257630-32142811.jpg',
        caption: 'Qutb Shahi Tombs Heritage Complex',
      },
    ],
    rentIndex: '₹11,000 – ₹18,500/mo',
    tiffinIndex: '₹2,400 – ₹3,200/mo',
    depositNorm: '2 Months Standard',
    hubs: ['HITEC City', 'Gachibowli', 'Madhapur', 'Kondapur'],
    teaserListings: [
      {
        id: 'hyd-teaser-1',
        name: 'Isthara Parks Co-Living Hub',
        locality: 'Gachibowli Tech Corridor',
        tag: 'Modern Studio PG • Food Included',
        rate: '₹13,000/mo',
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=80',
        url: '/hyderabad/housing',
      },
      {
        id: 'hyd-teaser-2',
        name: 'Nizami Flavours & Meals',
        locality: 'Madhapur Main Road',
        tag: 'Hyderabadi Home Tiffin & Curries',
        rate: '₹3,000/mo',
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=600&q=80',
        url: '/hyderabad/tiffin-mess',
      },
    ],
  },
  mumbai: {
    name: 'Mumbai',
    slug: 'mumbai',
    tag: 'The Maximum City',
    vibe: 'Sea Breeze, Financial District, Local Trains & Coastal Promenades',
    weather: '29°C Humid',
    aqi: 'AQI 72 Moderate',
    corridors: 'Metro Line 3 & Western Suburban',
    stat: '1,800+ Verified Nodes',
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1600&q=80',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1600&q=80',
        caption: 'Gateway of India & Waterfront Promenade',
      },
      {
        url: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=1600&q=80',
        caption: "Marine Drive Queen's Necklace Promenade",
      },
      {
        url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1600&q=80',
        caption: 'CSMT Victorian Gothic Railway Terminus',
      },
      {
        url: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&w=1600&q=80',
        caption: 'Bandra-Worli Sea Link Coastal Expressway',
      },
    ],
    rentIndex: '₹18,000 – ₹32,000/mo',
    tiffinIndex: '₹3,000 – ₹4,200/mo',
    depositNorm: '2-3 Months Standard',
    hubs: ['BKC', 'Bandra West', 'Andheri East', 'Powai'],
    teaserListings: [
      {
        id: 'mum-teaser-1',
        name: 'The Urban Nest Suites',
        locality: 'Bandra West, Mumbai',
        tag: 'Sea View Studio • Fully Serviced',
        rate: '₹24,000/mo',
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80',
        url: '/mumbai/housing',
      },
      {
        id: 'mum-teaser-2',
        name: 'Dabbawala Express Tiffin',
        locality: 'BKC / Kurla West',
        tag: 'Classic Maharashtrian Lunch Box',
        rate: '₹3,200/mo',
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1613292443284-c7f027eab819?auto=format&fit=crop&w=600&q=80',
        url: '/mumbai/tiffin-mess',
      },
    ],
  },
  pune: {
    name: 'Pune',
    slug: 'pune',
    tag: 'Oxford of the East',
    vibe: 'Lush Hills, Pleasant Weather, Automotive & IT Corridors',
    weather: '24°C Breezy',
    aqi: 'AQI 38 Clean',
    corridors: 'Hinjawadi Metro Line 3',
    stat: '750+ Verified Nodes',
    image: '/pune/pexels-charlieheng-15623165.jpg',
    images: [
      {
        url: '/pune/pexels-charlieheng-15623165.jpg',
        caption: 'Aga Khan Palace Historical Landmark',
      },
      {
        url: '/pune/pexels-ankit-rainloure-1425442-14441811.jpg',
        caption: 'Sinhagad Fort & Western Ghats Foothills',
      },
      {
        url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80',
        caption: 'Pashan Lake & Western Hills Sunset',
      },
      {
        url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1600&q=80',
        caption: 'Hinjawadi Rajiv Gandhi Infotech Park',
      },
    ],
    rentIndex: '₹10,500 – ₹17,000/mo',
    tiffinIndex: '₹2,400 – ₹3,000/mo',
    depositNorm: '2 Months Standard',
    hubs: ['Hinjawadi', 'Magarpatta', 'Viman Nagar', 'Baner'],
    teaserListings: [
      {
        id: 'pune-teaser-1',
        name: 'Hinjawadi IT Co-Living',
        locality: 'Hinjawadi Phase 1, Pune',
        tag: 'Walk to Tech Park • 3-Meal Mess',
        rate: '₹11,500/mo',
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80',
        url: '/pune/housing',
      },
      {
        id: 'pune-teaser-2',
        name: 'Annapurna Gharghuti Mess',
        locality: 'Viman Nagar, Pune',
        tag: 'Authentic Maharashtrian Poli Bhaji',
        rate: '₹2,600/mo',
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
        url: '/pune/tiffin-mess',
      },
    ],
  },
};

const CITY_KEYS = ['delhi', 'bengaluru', 'hyderabad', 'mumbai', 'pune'];

export default function InteractiveCitySwitcher() {
  const [activeSlug, setActiveSlug] = useState('delhi');
  const [slideIndex, setSlideIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [liveWeather, setLiveWeather] = useState(null);

  useEffect(() => {
    let isMounted = true;
    fetch('/api/weather')
      .then((res) => res.json())
      .then((json) => {
        if (isMounted && json.success && json.data) {
          setLiveWeather(json.data);
        }
      })
      .catch((err) => {
        console.warn('[Weather] Note:', err.message);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const city = CITY_PROFILES[activeSlug] || CITY_PROFILES.delhi;
  const slides = city.images && city.images.length > 0
    ? city.images
    : [{ url: city.image, caption: city.name }];

  // Auto-advance slideshow timer with pause on hover
  useEffect(() => {
    if (isHovered || slides.length <= 1) return;

    const interval = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isHovered, slides.length, activeSlug]);

  const handleNextSlide = (e) => {
    if (e?.preventDefault) e.preventDefault();
    if (e?.stopPropagation) e.stopPropagation();
    setSlideIndex((prev) => (prev + 1) % slides.length);
  };

  const handlePrevSlide = (e) => {
    if (e?.preventDefault) e.preventDefault();
    if (e?.stopPropagation) e.stopPropagation();
    setSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const [touchStartX, setTouchStartX] = useState(null);

  const handleTouchStart = (e) => {
    if (e.targetTouches && e.targetTouches.length > 0) {
      setTouchStartX(e.targetTouches[0].clientX);
    }
  };

  const handleTouchEnd = (e) => {
    if (touchStartX === null || !e.changedTouches || e.changedTouches.length === 0) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (diff > 45) {
      // Swiped left -> next photo
      setSlideIndex((prev) => (prev + 1) % slides.length);
    } else if (diff < -45) {
      // Swiped right -> prev photo
      setSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);
    }
    setTouchStartX(null);
  };

  const activeMetrics = liveWeather?.[activeSlug] || null;
  const currentTemp = activeMetrics?.temp || city.weather.split(' ')[0];
  const currentWeather = activeMetrics?.weather || city.weather;
  const currentAqiLabel = activeMetrics?.aqiLabel || city.aqi;

  const isAqiUnhealthy = activeMetrics?.aqiColor === 'red' || activeMetrics?.aqiColor === 'rose';
  const isAqiSensitive = activeMetrics?.aqiColor === 'orange';

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 flex flex-col gap-6">
      
      {/* City Tab Selector Pill Bar with Live Indicators */}
      <div className="flex items-center justify-start sm:justify-center gap-2.5 overflow-x-auto hide-scrollbar pb-2 pt-1">
        {CITY_KEYS.map((key) => {
          const c = CITY_PROFILES[key];
          const isActive = key === activeSlug;
          const tabTemp = liveWeather?.[key]?.temp || c.weather.split(' ')[0];
          return (
            <button
              key={key}
              type="button"
              onClick={() => {
                setActiveSlug(key);
                setSlideIndex(0);
              }}
              className={`flex items-center gap-2.5 px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap active:scale-95 border ${
                isActive
                  ? 'bg-[#2d2621] text-white border-[#2d2621] shadow-md'
                  : 'bg-white hover:bg-[#f5f0e8] text-gray-700 hover:text-[#2d2621] border-[#2d2621]/10'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full transition-colors ${
                  isActive ? 'bg-[#c85a32] animate-pulse' : 'bg-gray-300'
                }`}
              />
              <span className="font-semibold">{c.name}</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-medium transition-colors ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-[#f5f0e8] text-gray-500'
                }`}
              >
                {tabTemp}
              </span>
            </button>
          );
        })}
      </div>

      {/* Atmospheric Stage: Full Interactive Skyline Card with Slideshow */}
      <div
        id="city-skyline-stage"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative rounded-3xl overflow-hidden border border-[#2d2621]/15 shadow-2xl bg-[#2d2621] flex flex-col justify-between min-h-[460px] p-6 sm:p-10 group touch-pan-y"
      >
        
        {/* Cinematic Multi-Photo Crossfade Slideshow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {slides.map((slide, idx) => {
            const isActive = idx === slideIndex;
            return (
              <div
                key={slide.url}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  isActive ? 'opacity-85 z-[1]' : 'opacity-0 z-0'
                }`}
              >
                <img
                  src={slide.url}
                  alt={slide.caption || city.name}
                  className={`w-full h-full object-cover transition-transform duration-[6000ms] ease-out ${
                    isActive ? 'scale-105' : 'scale-100'
                  }`}
                  loading={idx === 0 ? 'eager' : 'lazy'}
                />
              </div>
            );
          })}
        </div>

        {/* Cinematic Gradient Scrim for Contrast & Warmth */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#2d2621] via-[#2d2621]/60 to-black/35 pointer-events-none z-[2]" />

        {/* Manual Slideshow Arrow Controls (Desktop hover) */}
        {slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrevSlide}
              aria-label="Previous landmark photo"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/75 backdrop-blur-md border border-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer shadow-lg active:scale-90"
            >
              <span className="material-symbols-outlined text-[20px]">chevron_left</span>
            </button>

            <button
              type="button"
              onClick={handleNextSlide}
              aria-label="Next landmark photo"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/75 backdrop-blur-md border border-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer shadow-lg active:scale-90"
            >
              <span className="material-symbols-outlined text-[20px]">chevron_right</span>
            </button>
          </>
        )}

        {/* Top Badges: Live Atmosphere, Transit Corridors & Landmark Photo Badge */}
        <div className="relative z-10 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="backdrop-blur-md bg-white/20 border border-white/25 text-white px-3.5 py-1.5 rounded-full text-[11px] font-bold tracking-wide flex items-center gap-1.5 shadow-sm">
              <span className="material-symbols-outlined text-[14px] text-amber-300">
                {activeMetrics?.condition?.includes('Rain') ? 'rainy' : activeMetrics?.condition?.includes('Cloud') ? 'partly_cloudy_day' : 'wb_sunny'}
              </span>
              <span>{currentWeather}</span>
              {liveWeather && (
                <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-white/25 text-white font-mono tracking-wider">
                  Live
                </span>
              )}
            </span>

            <span className={`backdrop-blur-md border px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 shadow-sm ${
              isAqiUnhealthy
                ? 'bg-rose-950/60 border-rose-400/40 text-rose-200'
                : isAqiSensitive
                ? 'bg-amber-950/60 border-orange-400/40 text-orange-200'
                : 'bg-emerald-950/50 border-emerald-400/40 text-emerald-200'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                isAqiUnhealthy ? 'bg-rose-400' : isAqiSensitive ? 'bg-orange-400' : 'bg-emerald-400'
              }`}></span>
              <span>{currentAqiLabel}</span>
            </span>

            {/* Live Landmark Photo Caption Pill */}
            {slides[slideIndex]?.caption && (
              <span className="backdrop-blur-md bg-black/45 border border-white/20 text-white/95 px-3.5 py-1.5 rounded-full text-[11px] font-semibold tracking-wide flex items-center gap-1.5 shadow-sm">
                <span className="material-symbols-outlined text-[13px] text-amber-300">photo_camera</span>
                <span className="max-w-[200px] sm:max-w-xs truncate">{slides[slideIndex].caption}</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Slideshow Progress Dots */}
            {slides.length > 1 && (
              <div className="backdrop-blur-md bg-black/45 border border-white/20 px-2.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                {slides.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSlideIndex(dotIdx);
                    }}
                    aria-label={`View photo ${dotIdx + 1} of ${slides.length}`}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      dotIdx === slideIndex
                        ? 'w-5 bg-[#c85a32]'
                        : 'w-1.5 bg-white/40 hover:bg-white/80'
                    }`}
                  />
                ))}
              </div>
            )}

            <span className="backdrop-blur-md bg-black/50 border border-white/15 text-white/90 px-4 py-1.5 rounded-full text-[11px] font-bold tracking-wider flex items-center gap-1.5 shadow-sm">
              <span className="material-symbols-outlined text-[15px] text-[#c85a32]">directions_transit</span>
              <span>{city.corridors}</span>
            </span>
          </div>
        </div>

        {/* Center/Bottom City Identity & Action Button */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6 text-white pt-16">
          <div className="flex flex-col gap-2 max-w-xl">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#c85a32]">
              {city.tag}
            </span>
            <h3 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-none drop-shadow-md">
              {city.name}
            </h3>
            <p className="text-sm text-white/90 font-medium leading-relaxed drop-shadow-sm mt-1">
              {city.vibe}
            </p>
          </div>

          <Link
            href={`/${city.slug}`}
            className="self-stretch sm:self-auto justify-center bg-white hover:bg-[#f5f0e8] text-[#2d2621] px-7 py-4 rounded-full text-xs font-extrabold uppercase tracking-widest flex items-center gap-2.5 shadow-2xl active:scale-95 transition-all group/btn cursor-pointer whitespace-nowrap"
          >
            <span>Enter {city.name} Portal</span>
            <span className="material-symbols-outlined text-[18px] text-[#c85a32] group-hover/btn:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </Link>
        </div>

        {/* Relocation Living Intelligence Strip (Integrated directly in the card) */}
        <div className="relative z-10 mt-8 pt-6 border-t border-white/15 grid grid-cols-2 md:grid-cols-4 gap-4 text-white">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-gray-300 uppercase tracking-wider">Avg 1BHK / PG</span>
            <span className="font-editorial text-base sm:text-lg font-bold text-white mt-0.5">{city.rentIndex}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-gray-300 uppercase tracking-wider">Tiffin & Mess</span>
            <span className="font-editorial text-base sm:text-lg font-bold text-white mt-0.5">{city.tiffinIndex}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-gray-300 uppercase tracking-wider">Security Deposit</span>
            <span className="text-xs sm:text-sm font-semibold text-white/90 mt-1">{city.depositNorm}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-gray-300 uppercase tracking-wider">Verified Nodes</span>
            <span className="text-xs sm:text-sm font-semibold text-emerald-300 flex items-center gap-1 mt-1">
              <span className="material-symbols-outlined text-[15px]">verified</span>
              <span>{city.stat}</span>
            </span>
          </div>
        </div>

      </div>

      {/* Relocation Corridors & Instant Category Quick-Launchers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left 5 Cols: Top Living Hubs & Direct Category Launchers */}
        <div className="lg:col-span-5 flex flex-col gap-4 bg-white rounded-3xl p-6 border border-[#2d2621]/10 shadow-sm">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#c85a32]">
              Prime Living Corridors
            </span>
            <h4 className="font-editorial text-xl font-bold text-[#2d2621] mt-0.5">
              Top Neighborhoods in {city.name}
            </h4>
          </div>

          {/* Clickable Neighborhood Chips */}
          <div className="flex flex-wrap gap-2">
            {city.hubs.map((hub) => (
              <Link
                key={hub}
                href={`/${city.slug}/housing?search=${encodeURIComponent(hub)}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#f5f0e8] hover:bg-[#ebe4d8] text-[#2d2621] border border-[#2d2621]/[0.08] transition-all hover:border-[#c85a32]/30 active:scale-95"
              >
                <span className="material-symbols-outlined text-[13px] text-[#c85a32]">location_on</span>
                <span>{hub}</span>
              </Link>
            ))}
          </div>

          <hr className="border-[#2d2621]/[0.06] my-1" />

          {/* 4 Instant Category Buttons */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">
              Direct Service Launchers
            </span>
            <div className="grid grid-cols-2 gap-2">
              <Link
                href={`/${city.slug}/housing`}
                className="flex items-center gap-2 p-3 rounded-2xl bg-[#fdfbf7] hover:bg-[#f5f0e8] border border-[#2d2621]/[0.08] transition-all group"
              >
                <span className="material-symbols-outlined text-[18px] text-[#c85a32] group-hover:scale-110 transition-transform">
                  apartment
                </span>
                <span className="text-xs font-bold text-[#2d2621]">Stays & PGs</span>
              </Link>

              <Link
                href={`/${city.slug}/tiffin-mess`}
                className="flex items-center gap-2 p-3 rounded-2xl bg-[#fdfbf7] hover:bg-[#f5f0e8] border border-[#2d2621]/[0.08] transition-all group"
              >
                <span className="material-symbols-outlined text-[18px] text-amber-700 group-hover:scale-110 transition-transform">
                  restaurant
                </span>
                <span className="text-xs font-bold text-[#2d2621]">Tiffins & Mess</span>
              </Link>

              <Link
                href={`/${city.slug}/maid-cook`}
                className="flex items-center gap-2 p-3 rounded-2xl bg-[#fdfbf7] hover:bg-[#f5f0e8] border border-[#2d2621]/[0.08] transition-all group"
              >
                <span className="material-symbols-outlined text-[18px] text-[#5b6951] group-hover:scale-110 transition-transform">
                  mop
                </span>
                <span className="text-xs font-bold text-[#2d2621]">Cooks & Maids</span>
              </Link>

              <Link
                href={`/${city.slug}/sabji-mandi`}
                className="flex items-center gap-2 p-3 rounded-2xl bg-[#fdfbf7] hover:bg-[#f5f0e8] border border-[#2d2621]/[0.08] transition-all group"
              >
                <span className="material-symbols-outlined text-[18px] text-emerald-600 group-hover:scale-110 transition-transform">
                  eco
                </span>
                <span className="text-xs font-bold text-[#2d2621]">Fresh Mandis</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Right 7 Cols: Curated Verified Listings Preview Rail */}
        <div className="lg:col-span-7 flex flex-col gap-4 bg-white rounded-3xl p-6 border border-[#2d2621]/10 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#c85a32]">
                Audited Listings Preview
              </span>
              <h4 className="font-editorial text-xl font-bold text-[#2d2621] mt-0.5">
                Featured Verified Nodes in {city.name}
              </h4>
            </div>
            <Link
              href={`/${city.slug}`}
              className="text-xs font-bold text-[#c85a32] hover:underline flex items-center gap-1"
            >
              <span>View all</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {city.teaserListings.map((teaser) => (
              <Link
                key={teaser.id}
                href={teaser.url}
                className="flex flex-col bg-[#fdfbf7] rounded-2xl border border-[#2d2621]/[0.08] overflow-hidden group hover:shadow-md transition-all"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                  <img
                    src={teaser.image}
                    alt={teaser.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-md text-white text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="material-symbols-outlined text-[11px] text-[#c85a32]">verified</span>
                    <span>Audited</span>
                  </div>
                  <div className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-md text-[#2d2621] text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-sm">
                    <span className="material-symbols-outlined text-[12px] text-amber-500 fill-amber-500">star</span>
                    <span>{teaser.rating}</span>
                  </div>
                </div>

                <div className="p-4 flex flex-col justify-between flex-grow gap-2">
                  <div>
                    <span className="text-[9px] font-extrabold text-[#c85a32] uppercase tracking-wider">
                      {teaser.tag}
                    </span>
                    <h5 className="font-editorial text-base font-bold text-[#2d2621] leading-snug line-clamp-1 group-hover:text-[#c85a32] transition-colors mt-0.5">
                      {teaser.name}
                    </h5>
                    <p className="text-[11px] text-gray-500 font-medium flex items-center gap-1 mt-0.5">
                      <span className="material-symbols-outlined text-[13px] text-gray-400">location_on</span>
                      <span>{teaser.locality}</span>
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#2d2621]/[0.06] flex items-center justify-between">
                    <span className="font-editorial text-sm font-bold text-[#2d2621]">
                      {teaser.rate}
                    </span>
                    <span className="text-[10px] font-extrabold text-[#c85a32] uppercase tracking-widest flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                      <span>Inspect</span>
                      <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
}
