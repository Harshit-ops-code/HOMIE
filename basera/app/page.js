'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import Navbar from '@/components/layout/Navbar';
import dynamic from 'next/dynamic';

// Dynamically import Leaflet Map to disable Server-Side Rendering (SSR) issues
const LandingHubMap = dynamic(
  () => import('@/components/landing/LandingHubMap'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[400px] bg-slate-50 flex flex-col items-center justify-center text-xs font-bold text-gray-400 gap-3 border border-outline rounded-3xl">
        <span className="material-symbols-outlined text-[32px] text-gray-300 animate-spin">progress_activity</span>
        <span>Loading Hub Map...</span>
      </div>
    )
  }
);
import InteractiveCitySwitcher from '@/components/landing/InteractiveCitySwitcher';

const CITIES = [
  { name: 'Bengaluru', slug: 'bengaluru', icon: 'park', desc: 'Silicon Valley & Cafes', tag: 'Silicon Valley of India', tagColor: 'bg-amber-600/90', image: '/benguluru/pexels-akhil-dasari-2160057282-36817688.jpg' },
  { name: 'Mumbai', slug: 'mumbai', icon: 'waves', desc: 'Sea Breeze & Bollywood', tag: 'Sea Breeze & Bollywood', tagColor: 'bg-emerald-700/90', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80' },
  { name: 'Delhi NCR', slug: 'delhi', icon: 'account_balance', desc: 'Heritage & Street Food', tag: 'Heart of the Nation', tagColor: 'bg-terracotta/90', image: '/Delhi/delhi1.jpg' },
  { name: 'Hyderabad', slug: 'hyderabad', icon: 'fort', desc: 'Pearls & Cyber Hubs', tag: 'Pearls & Cyber Hubs', tagColor: 'bg-olive/90', image: '/hyderabad/pexels-dropshado-11321242.jpg' },
  { name: 'Pune', slug: 'pune', icon: 'landscape', desc: 'Hills & Student Culture', tag: 'The Cultural Hub', tagColor: 'bg-stone-600/90', image: '/pune/pexels-charlieheng-15623165.jpg' }
];

const heroSlides = [
  '/Delhi/delhi1.jpg',
  '/hyderabad/pexels-dropshado-11321242.jpg',
  '/pune/pexels-ankit-rainloure-1425442-14441811.jpg'
];

export default function LandingPage() {
  const { data: session, status } = useSession();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, {
      threshold: 0.05,
      rootMargin: '0px 0px -20px 0px'
    });

    const elements = document.querySelectorAll('.reveal');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  const handleMouseMove = (e) => {
    const cards = document.querySelectorAll('.glow-card');
    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  };

  const filteredCities = CITIES.filter(city => 
    city.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="text-on-surface font-body-md antialiased min-h-screen flex flex-col bg-pattern relative overflow-x-hidden">
      
      {/* Floating Aurora Blobs for Apple/Linear Style Ambient Depth */}
      <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] rounded-full bg-indigo-200/25 blur-3xl pointer-events-none select-none animate-pulse duration-[12000ms] -z-30"></div>
      <div className="absolute top-[200px] right-[-100px] w-[600px] h-[600px] rounded-full bg-rose-100/20 blur-3xl pointer-events-none select-none animate-pulse duration-[16000ms] -z-30"></div>
      <div className="absolute top-[600px] left-[15%] w-[450px] h-[450px] rounded-full bg-blue-100/15 blur-3xl pointer-events-none select-none -z-30"></div>

      {/* Full-Bleed Seamless City Slideshow Background Watermark (No Edges/Boxes) */}
      <div className="absolute top-0 left-0 right-0 h-[620px] -z-20 overflow-hidden pointer-events-none select-none">
        {heroSlides.map((img, idx) => (
          <img
            key={img}
            src={img}
            alt="Direct Relocation Hub"
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-[1500ms] ease-in-out ${idx === currentSlide ? 'opacity-[0.38] scale-102' : 'opacity-0 scale-100'}`}
          />
        ))}
        {/* Soft vignette to fade the slideshow bottom edge seamlessly into the page background */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#faf9f6] z-10"></div>
      </div>

      {/* Top Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col relative">
        
        {/* Harmonized Light-Theme Hero Section (Seamless Content Layout) */}
        <section className="relative w-full pt-10 sm:pt-20 pb-8 sm:pb-16 px-4 sm:px-6 max-w-5xl mx-auto text-center flex flex-col items-center gap-4 sm:gap-6 z-10">
          {/* Subtle glowing radial halo behind the text content area to ensure high contrast */}
          <div className="absolute inset-x-0 top-6 bottom-6 bg-[radial-gradient(circle,rgba(255,255,255,0.85)_0%,rgba(255,255,255,0.4)_50%,transparent_100%)] -z-10 rounded-full blur-2xl max-w-4xl mx-auto"></div>

          <div className="inline-flex items-center gap-2 bg-sand/80 border border-outline px-3 sm:px-4 py-1 sm:py-1.5 rounded-full shadow-sm backdrop-blur-md">
            <span className="material-symbols-outlined text-terracotta text-[14px] sm:text-[15px]">verified_user</span>
            <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest text-primary">
              India&apos;s Direct Relocation & Local Guide
            </span>
          </div>
          
          <h1 className="font-editorial text-4xl sm:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05] sm:leading-[0.98] max-w-5xl text-primary select-none">
            Settle in like a <span className="shimmer-text">local.</span> <br />
            <span className="font-editorial text-primary text-2xl sm:text-5xl lg:text-7xl font-bold leading-tight block mt-1.5 sm:mt-2 text-stone-700">
              <span className="text-terracotta">बिना ब्रोकर</span>, घर जैसा एहसास।
            </span>
          </h1>

          <p className="text-xs sm:text-base text-gray-500 font-medium max-w-2xl leading-relaxed mt-0.5 sm:mt-1">
            Skip broker lists and fake pictures. We audit stays, map transport corridors, test regional meals, and verify helper contacts so you move with absolute confidence.
          </p>

          {/* Quick Search Floating Glassmorphic Bar with Action Button */}
          <div className="w-full max-w-xl mt-1 sm:mt-3 relative group z-30">
            <div className="absolute -inset-1.5 bg-terracotta/10 rounded-full blur opacity-40 group-hover:opacity-70 transition duration-300"></div>
            <div className="relative flex items-center w-full">
              <input 
                type="text"
                placeholder="Search your destination city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-outline rounded-full py-3.5 sm:py-4 pl-11 sm:pl-12 pr-24 sm:pr-28 focus:ring-4 focus:ring-terracotta/10 focus:border-terracotta transition-all text-xs sm:text-sm font-semibold outline-none text-primary shadow-lg hover:shadow-xl"
              />
              <span className="absolute left-3.5 sm:left-4 top-[14px] sm:top-[15px] text-gray-400 material-symbols-outlined text-[18px] sm:text-[20px]">search</span>
              <button 
                type="button"
                onClick={() => {
                  const citiesSection = document.getElementById('cities');
                  if (citiesSection) {
                    citiesSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="absolute right-1.5 sm:right-2 top-1.5 sm:top-2 bottom-1.5 sm:bottom-2 bg-terracotta hover:bg-[#b04d29] text-white px-4 sm:px-6 rounded-full text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider active:scale-95 transition-all flex items-center justify-center gap-1 shadow-sm cursor-pointer"
              >
                Explore
                <span className="material-symbols-outlined text-[12px] sm:text-[13px] text-white">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* Active hubs indicators */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mt-1 sm:mt-2 text-[9px] sm:text-[10px] text-gray-500 font-bold uppercase tracking-widest select-none text-center">
            <span className="w-2 h-2 rounded-full bg-terracotta animate-pulse inline-block"></span>
            <span>Active Relocation Hubs: Delhi • Hyderabad • Bengaluru • Mumbai • Pune</span>
          </div>
        </section>

        {/* City Hub Cards Section - Interactive Atmosphere Switcher */}
        <section id="cities" className="reveal py-10 sm:py-20 bg-sand/30 border-y border-outline relative z-10">
          <div className="max-w-7xl mx-auto px-6 mb-8 text-center flex flex-col items-center gap-1.5">
            <span className="text-[10px] text-terracotta font-extrabold uppercase tracking-widest">
              Explore Active Relocation Portals
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-primary tracking-tight">
              Choose your next neighborhood
            </h2>
            <p className="text-xs text-gray-500 font-medium max-w-md">
              Switch between tier-1 relocation corridors to inspect live weather, transit connectivity, and verified nodes.
            </p>
          </div>

          <InteractiveCitySwitcher />
        </section>

        {/* Services Bento Grid Section */}
        <section id="services" className="reveal py-28 max-w-max-width-desktop mx-auto px-6 w-full relative z-10">
          <div className="text-center mb-16 flex flex-col items-center gap-1.5">
            <span className="text-[10px] text-terracotta font-extrabold uppercase tracking-widest">Everything you need to settle in</span>
            <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-primary tracking-tight">Relocate in minutes, not months.</h2>
          </div>

          <div onMouseMove={handleMouseMove} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Bento Card 1 */}
            <div className="glow-card p-8 rounded-3xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col gap-5 border border-outline">
              <div className="relative z-10 w-12 h-12 rounded-2xl bg-sand border border-outline flex items-center justify-center text-terracotta shadow-sm">
                <span className="material-symbols-outlined text-[24px]">apartment</span>
              </div>
              <div className="relative z-10">
                <h3 className="font-editorial text-xl font-bold text-primary mb-2">Verified Stays</h3>
                <p className="text-xs text-gray-500 font-medium leading-relaxed">
                  Broker-free properties with fully audited agreements, coordinate mapping details, and exact deposit parameters.
                </p>
              </div>
            </div>

            {/* Bento Card 2 */}
            <div className="glow-card p-8 rounded-3xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col gap-5 border border-outline">
              <div className="relative z-10 w-12 h-12 rounded-2xl bg-sand border border-outline flex items-center justify-center text-amber-700 shadow-sm">
                <span className="material-symbols-outlined text-[24px]">bento</span>
              </div>
              <div className="relative z-10">
                <h3 className="font-editorial text-xl font-bold text-primary mb-2">Tiffin & Messes</h3>
                <p className="text-xs text-gray-500 font-medium leading-relaxed">
                  Discover local home kitchens delivering regional tiffins. Free test trials and transparent subscription models.
                </p>
              </div>
            </div>

            {/* Bento Card 3 */}
            <div className="glow-card p-8 rounded-3xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col gap-5 border border-outline">
              <div className="relative z-10 w-12 h-12 rounded-2xl bg-sand border border-outline flex items-center justify-center text-olive shadow-sm">
                <span className="material-symbols-outlined text-[24px]">cleaning_services</span>
              </div>
              <div className="relative z-10">
                <h3 className="font-editorial text-xl font-bold text-primary mb-2">Verified Helpers</h3>
                <p className="text-xs text-gray-500 font-medium leading-relaxed">
                  Cooks, maids, and housekeepers with background audits, standard rates, and active contact numbers.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Basera Guarantee */}
        <section id="why-basera" className="reveal py-20 bg-sand/40 border-t border-outline relative z-10">
          <div className="max-w-4xl mx-auto px-6 text-center flex flex-col items-center gap-4">
            <h2 className="font-editorial text-3xl font-bold text-primary tracking-tight">The Local Guide Standard</h2>
            <p className="text-xs sm:text-sm text-gray-500 font-medium max-w-2xl leading-relaxed">
              We visit and audit every flat, kitchen, and helper resource listed. Zero brokerage fees, zero hidden markup subscriptions, and direct community connections.
            </p>
            <div className="flex gap-8 justify-center flex-wrap mt-4 text-[10px] font-bold text-primary tracking-widest uppercase">
              <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-olive text-[16px]">check_circle</span> Zero Brokerage</span>
              <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-olive text-[16px]">check_circle</span> Direct Audited Stays</span>
              <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-olive text-[16px]">check_circle</span> Verified Meals</span>
            </div>
          </div>
        </section>

        {/* Bottom Interactive Coverage Map Checker */}
        <section className="reveal py-24 bg-white border-t border-outline relative z-10">
          <div className="max-w-max-width-desktop mx-auto px-6 flex flex-col lg:flex-row items-center gap-12">
            
            {/* Left side: Directory list & text */}
            <div className="w-full lg:w-5/12 flex flex-col items-start gap-5 text-left">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-terracotta bg-terracotta-light border border-terracotta/20 px-3.5 py-1.5 rounded-xl shadow-sm">
                Interactive Directory
              </span>
              <h2 className="font-editorial text-3xl font-bold text-primary tracking-tight">
                Check Hub Coverage
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 font-medium leading-relaxed">
                Explore verified relocation corridors, active neighborhood clusters, and nearby amenities across all supported metro areas.
              </p>

              {/* Quick links directory */}
              <div className="w-full flex flex-col gap-2.5 mt-2">
                {CITIES.map(city => (
                  <Link 
                    key={city.slug} 
                    href={`/${city.slug}`}
                    className="flex justify-between items-center bg-sand/50 hover:bg-white p-3 rounded-2xl border border-outline hover:border-terracotta/30 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-white border border-outline flex items-center justify-center text-primary group-hover:text-terracotta transition-colors">
                        <span className="material-symbols-outlined text-[18px]">{city.icon}</span>
                      </div>
                      <span className="text-xs font-bold text-primary group-hover:text-terracotta transition-colors">{city.name}</span>
                    </div>
                    <span className="material-symbols-outlined text-[16px] text-gray-400 group-hover:text-terracotta group-hover:translate-x-0.5 transition-all">arrow_forward</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Right side: Interactive map */}
            <div className="w-full lg:w-7/12 h-[380px] md:h-[420px] relative flex-shrink-0">
              <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500/5 to-pink-500/5 rounded-[32px] blur-xl opacity-60"></div>
              <div className="h-full w-full relative z-10">
                <LandingHubMap />
              </div>
            </div>

          </div>
        </section>

      </main>

      {/* Grounded Premium Themed Dark Footer */}
      <footer className="bg-primary text-white/90 border-t border-primary-container/10 pt-20 pb-10 relative z-10">
        <div className="max-w-max-width-desktop mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 mb-16 text-left">
          <div className="flex flex-col gap-5">
            <Link href="/" className="font-plus-jakarta text-2xl font-extrabold text-white flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[28px] text-white">home_pin</span>
              <span>Basera</span>
            </Link>
            <p className="text-xs text-white/50 font-semibold leading-relaxed">
              Settle in like a local. India&apos;s premium relocation guide.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-2">Services</h4>
            <Link href="/onboard" className="text-xs font-semibold text-white/60 hover:text-white transition-colors">Stays & PGs</Link>
            <Link href="/onboard" className="text-xs font-semibold text-white/60 hover:text-white transition-colors">Tiffin Subscriptions</Link>
            <Link href="/onboard" className="text-xs font-semibold text-white/60 hover:text-white transition-colors">Maids & Cook References</Link>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-2">Partnership</h4>
            <Link href="/onboard" className="text-xs font-semibold text-white/60 hover:text-white transition-colors">Register Stay Node</Link>
            <Link href="/onboard" className="text-xs font-semibold text-white/60 hover:text-white transition-colors">List Meal Service</Link>
            <Link href="/onboard" className="text-xs font-semibold text-white/60 hover:text-white transition-colors">Refer Helpers</Link>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-2">Legal</h4>
            <a href="#" className="text-xs font-semibold text-white/60 hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="text-xs font-semibold text-white/60 hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="text-xs font-semibold text-white/60 hover:text-white transition-colors">Support Desk</a>
          </div>
        </div>

        <div className="max-w-max-width-desktop mx-auto px-6 pt-10 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-bold text-white/40 uppercase tracking-widest">
          <p>© {new Date().getFullYear()} Basera. Designed for clarity.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white/80">Privacy</a>
            <a href="#" className="hover:text-white/80">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
