'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import CommandPalette from '@/components/layout/CommandPalette';

const CITIES_NAV = [
  { name: 'Delhi NCR', slug: 'delhi', icon: 'account_balance', subtitle: 'Cyber City, CP, Noida' },
  { name: 'Bengaluru', slug: 'bengaluru', icon: 'park', subtitle: 'Koramangala, HSR, Indiranagar' },
  { name: 'Hyderabad', slug: 'hyderabad', icon: 'fort', subtitle: 'HITEC City, Madhapur, Gachibowli' },
  { name: 'Mumbai', slug: 'mumbai', icon: 'waves', subtitle: 'BKC, Bandra, Andheri East' },
  { name: 'Pune', slug: 'pune', icon: 'landscape', subtitle: 'Hinjawadi, Magarpatta, Viman Nagar' },
];

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cityMenuOpen, setCityMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const cityDropdownRef = useRef(null);
  const userDropdownRef = useRef(null);

  const openPalette = () => {
    setCityMenuOpen(false);
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    setPaletteOpen(true);
  };

  // Detect active city from URL
  const currentCityMatch = pathname?.match(/^\/(delhi|bengaluru|hyderabad|mumbai|pune)/i);
  const activeCitySlug = currentCityMatch ? currentCityMatch[1].toLowerCase() : null;
  const activeCity = CITIES_NAV.find(c => c.slug === activeCitySlug);

  // Scroll detection for dynamic glassmorphic elevation
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Click outside or press Escape to close dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(e.target)) {
        setCityMenuOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setCityMenuOpen(false);
        setDropdownOpen(false);
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Close menus on route change safely
  useEffect(() => {
    const timer = setTimeout(() => {
      setCityMenuOpen(false);
      setDropdownOpen(false);
      setMobileMenuOpen(false);
    }, 0);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <>
      <header className="sticky top-4 z-50 w-full px-3 sm:px-6 pointer-events-none mb-2">
        <nav
          className={`pointer-events-auto max-w-7xl mx-auto transition-all duration-300 rounded-full px-4 sm:px-6 flex items-center justify-between border ${
            isScrolled
              ? 'h-[58px] bg-white/90 backdrop-blur-2xl border-[#2d2621]/15 shadow-[0_12px_36px_rgb(0,0,0,0.08)]'
              : 'h-[64px] bg-white/80 backdrop-blur-xl border-[#2d2621]/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]'
          }`}
        >
          {/* Left: Brand Logo & Interactive City Switcher Pill */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link href="/" className="flex items-center gap-2 group tracking-tight">
              <div className="w-8 h-8 rounded-full bg-[#c85a32]/10 border border-[#c85a32]/25 flex items-center justify-center text-[#c85a32] group-hover:scale-105 group-hover:bg-[#c85a32] group-hover:text-white transition-all duration-300 shadow-sm">
                <span className="material-symbols-outlined text-[19px]">roofing</span>
              </div>
              <span className="font-editorial text-2xl font-bold text-[#2d2621] tracking-tight">
                Basera
              </span>
            </Link>

            {/* City Selector Pill */}
            <div className="relative" ref={cityDropdownRef}>
              <button
                type="button"
                onClick={() => setCityMenuOpen(!cityMenuOpen)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all border cursor-pointer active:scale-95 ${
                  activeCity
                    ? 'bg-[#c85a32]/10 border-[#c85a32]/30 text-[#c85a32] hover:bg-[#c85a32]/15'
                    : 'bg-[#f5f0e8]/80 hover:bg-[#f5f0e8] border-[#2d2621]/10 text-gray-700 hover:text-[#2d2621]'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#c85a32] animate-pulse"></span>
                <span className="truncate max-w-[90px] sm:max-w-none">
                  {activeCity ? activeCity.name : 'All Cities'}
                </span>
                <span className={`material-symbols-outlined text-[14px] transition-transform duration-200 ${cityMenuOpen ? 'rotate-180' : ''}`}>
                  keyboard_arrow_down
                </span>
              </button>

              {/* City Dropdown Menu */}
              {cityMenuOpen && (
                <div className="absolute left-0 mt-3 w-64 bg-white/95 backdrop-blur-2xl border border-[#2d2621]/15 rounded-3xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                  <div className="px-3 py-2 border-b border-[#2d2621]/10 mb-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#c85a32]">
                      Direct Relocation Portals
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    {CITIES_NAV.map((c) => {
                      const isCurrent = c.slug === activeCitySlug;
                      return (
                        <Link
                          key={c.slug}
                          href={`/${c.slug}`}
                          onClick={() => setCityMenuOpen(false)}
                          className={`flex items-center justify-between px-3 py-2.5 rounded-2xl transition-all ${
                            isCurrent
                              ? 'bg-[#2d2621] text-white'
                              : 'hover:bg-[#f5f0e8] text-[#2d2621]'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className={`material-symbols-outlined text-[18px] ${isCurrent ? 'text-[#c85a32]' : 'text-gray-500'}`}>
                              {c.icon}
                            </span>
                            <div className="min-w-0">
                              <p className="text-xs font-bold truncate leading-tight">{c.name}</p>
                              <p className={`text-[9px] truncate ${isCurrent ? 'text-gray-300' : 'text-gray-400'}`}>
                                {c.subtitle}
                              </p>
                            </div>
                          </div>
                          {isCurrent && (
                            <span className="text-[9px] font-extrabold bg-[#c85a32] text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                              Active
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Navigation Links, Auth & Controls */}
          <div className="flex items-center gap-3 sm:gap-6">
            
            {/* Desktop Quick Nav Links */}
            <div className="hidden md:flex items-center gap-6 font-bold text-[11px] tracking-widest uppercase text-gray-500">
              <Link href="/#cities" className="hover:text-[#c85a32] transition-colors">
                Destinations
              </Link>
              <Link href="/#services" className="hover:text-[#c85a32] transition-colors">
                Services
              </Link>
              {activeCity ? (
                <Link
                  href={`/${activeCity.slug}/housing`}
                  className="hover:text-[#c85a32] transition-colors flex items-center gap-1.5 text-[#c85a32]"
                >
                  <span className="material-symbols-outlined text-[15px]">apartment</span>
                  <span>{activeCity.name.split(' ')[0]} Stays</span>
                </Link>
              ) : (
                <Link
                  href="/delhi"
                  className="hover:text-[#c85a32] transition-colors flex items-center gap-1.5 text-[#c85a32]"
                >
                  <span className="material-symbols-outlined text-[15px]">explore</span>
                  <span>Explore Portals</span>
                </Link>
              )}
            </div>

            {/* User Session Profile or Get Started CTA */}
            {status === 'authenticated' ? (
              <div className="relative" ref={userDropdownRef}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 text-xs font-bold text-gray-700 hover:text-primary transition-all focus:outline-none cursor-pointer"
                >
                  <span className="bg-[#c85a32]/10 text-[#c85a32] w-8 h-8 rounded-full flex items-center justify-center font-plus-jakarta uppercase font-extrabold border border-[#c85a32]/25 shadow-sm">
                    {session.user?.name?.charAt(0) || 'U'}
                  </span>
                  <span className="hidden sm:inline text-xs font-bold truncate max-w-[100px]">
                    {session.user?.name || 'Account'}
                  </span>
                  <span className="material-symbols-outlined text-sm text-gray-400">
                    keyboard_arrow_down
                  </span>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white/95 backdrop-blur-2xl border border-[#2d2621]/15 rounded-3xl shadow-2xl py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-2 border-b border-[#2d2621]/10 mb-2">
                      <p className="text-xs font-bold text-[#2d2621] truncate">{session.user?.name}</p>
                      <p className="text-[10px] text-gray-400 truncate">{session.user?.email}</p>
                      <span className="inline-block mt-1 text-[9px] bg-[#c85a32]/10 text-[#c85a32] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                        {session.user?.role || 'Verified Mover'}
                      </span>
                    </div>

                    <Link
                      href="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-[#f5f0e8] hover:text-[#2d2621] transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm text-[#c85a32]">person</span>
                      Profile & Relocation Details
                    </Link>

                    <Link
                      href="/saved"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-[#f5f0e8] hover:text-[#2d2621] transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm text-[#c85a32]">bookmark</span>
                      Saved Listings & Stays
                    </Link>

                    <hr className="border-[#2d2621]/10 my-2" />

                    <button
                      type="button"
                      onClick={() => {
                        setDropdownOpen(false);
                        signOut({ callbackUrl: '/' });
                      }}
                      className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-red-500 hover:bg-red-50/70 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">logout</span>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="text-xs font-bold text-gray-600 hover:text-[#c85a32] transition-colors uppercase tracking-wider px-2 sm:px-3 py-1.5 hidden sm:block"
                >
                  Sign In
                </Link>
                <Link
                  href="/login"
                  className="hidden sm:inline-flex text-xs bg-[#c85a32] hover:bg-[#b04d29] text-white px-4 py-2 rounded-full transition-all font-bold uppercase tracking-widest shadow-sm active:scale-95 cursor-pointer whitespace-nowrap"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Menu"
              className="md:hidden w-8 h-8 rounded-full bg-[#f5f0e8] flex items-center justify-center text-gray-700 hover:text-[#2d2621] transition-colors cursor-pointer border border-[#2d2621]/10"
            >
              <span className="material-symbols-outlined text-[19px]">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>

          </div>
        </nav>

        {/* Mobile Frosted Slide-Down Menu Sheet */}
        {mobileMenuOpen && (
          <div className="pointer-events-auto md:hidden mt-2 max-w-7xl mx-auto bg-white/95 backdrop-blur-2xl border border-[#2d2621]/15 rounded-3xl shadow-2xl p-5 animate-in fade-in slide-in-from-top-3 duration-200">
            <div className="flex flex-col gap-4">
              {/* City Portals Grid */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#c85a32]">
                  Relocation Portals
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {CITIES_NAV.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/${c.slug}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-2 p-2.5 rounded-2xl text-xs font-bold transition-all border ${
                        c.slug === activeCitySlug
                          ? 'bg-[#2d2621] text-white border-transparent'
                          : 'bg-[#f5f0e8]/60 hover:bg-[#f5f0e8] text-[#2d2621] border-[#2d2621]/10'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px] text-[#c85a32]">{c.icon}</span>
                      <span className="truncate">{c.name}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Direct Service Jump */}
              <div className="flex flex-col gap-1.5 pt-2 border-t border-[#2d2621]/10">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">
                  Essential Services
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-gray-700">
                  <Link
                    href={activeCity ? `/${activeCity.slug}/housing` : '/delhi/housing'}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 p-2 rounded-xl hover:bg-[#f5f0e8]"
                  >
                    <span className="material-symbols-outlined text-[16px] text-[#c85a32]">apartment</span>
                    <span>Verified Stays</span>
                  </Link>
                  <Link
                    href={activeCity ? `/${activeCity.slug}/tiffin-mess` : '/delhi/tiffin-mess'}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 p-2 rounded-xl hover:bg-[#f5f0e8]"
                  >
                    <span className="material-symbols-outlined text-[16px] text-amber-700">restaurant</span>
                    <span>Tiffins & Mess</span>
                  </Link>
                  <Link
                    href={activeCity ? `/${activeCity.slug}/maid-cook` : '/delhi/maid-cook'}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 p-2 rounded-xl hover:bg-[#f5f0e8]"
                  >
                    <span className="material-symbols-outlined text-[16px] text-[#5b6951]">mop</span>
                    <span>Cook & Maid</span>
                  </Link>
                  <Link
                    href={activeCity ? `/${activeCity.slug}/sabji-mandi` : '/delhi/sabji-mandi'}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 p-2 rounded-xl hover:bg-[#f5f0e8]"
                  >
                    <span className="material-symbols-outlined text-[16px] text-emerald-600">eco</span>
                    <span>Local Mandi</span>
                  </Link>
                </div>
              </div>

              {/* Mobile Auth Actions */}
              {status !== 'authenticated' && (
                <div className="pt-2 border-t border-[#2d2621]/10 flex items-center gap-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 py-2.5 rounded-full text-center text-xs font-bold bg-[#f5f0e8] text-[#2d2621] uppercase tracking-wider"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 py-2.5 rounded-full text-center text-xs font-bold bg-[#c85a32] text-white uppercase tracking-wider shadow-sm"
                  >
                    Get Started
                  </Link>
                </div>
              )}

            </div>
          </div>
        )}

      </header>

      {/* Universal Command Palette Modal */}
      <CommandPalette isOpen={paletteOpen} onClose={setPaletteOpen} />
    </>
  );
}
