'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
  const { data: session, status } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="bg-white/80 border-b border-outline/50 backdrop-blur-md sticky top-0 z-50 transition-all duration-300">
      <div className="flex justify-between items-center w-full px-6 max-w-max-width-desktop mx-auto h-[76px]">
        {/* Logo */}
        <Link href="/" className="font-plus-jakarta text-2xl font-extrabold text-primary flex items-center gap-2.5 tracking-tight">
          <span className="material-symbols-outlined text-[28px] text-primary">home_pin</span>
          <span>Basera</span>
        </Link>
        
        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8 font-bold text-[11px] tracking-widest uppercase text-gray-500">
          <Link href="/#cities" className="hover:text-primary transition-colors">Destinations</Link>
          <Link href="/#services" className="hover:text-primary transition-colors">Services</Link>
          <Link href="/#why-basera" className="hover:text-primary transition-colors">Verification</Link>
        </div>
        
        {/* Auth / Profile Area */}
        <div className="flex items-center gap-6 relative">
          {status === 'authenticated' ? (
            <div className="relative">
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 text-xs font-bold text-gray-700 hover:text-primary transition-all focus:outline-none cursor-pointer"
              >
                <span className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center font-plus-jakarta uppercase">
                  {session.user?.name?.charAt(0) || 'U'}
                </span>
                <span className="hidden sm:inline">{session.user?.name || 'My Account'}</span>
                <span className="material-symbols-outlined text-sm">keyboard_arrow_down</span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white border border-outline rounded-2xl shadow-xl py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-2 border-b border-outline/50 mb-2">
                    <p className="text-xs font-bold text-primary truncate">{session.user?.name}</p>
                    <p className="text-[10px] text-gray-400 truncate">{session.user?.email}</p>
                    <span className="inline-block mt-1 text-[9px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                      {session.user?.role || 'user'}
                    </span>
                  </div>
                  
                  <Link 
                    href="/profile" 
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">person</span>
                    Profile Details
                  </Link>

                  <Link 
                    href="/saved" 
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">bookmark</span>
                    Saved Listings
                  </Link>

                  {(session.user?.role === 'vendor' || session.user?.role === 'admin') ? (
                    <Link 
                      href="/vendor/dashboard" 
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 hover:text-primary transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">dashboard</span>
                      Vendor Dashboard
                    </Link>
                  ) : (
                    <Link 
                      href="/onboard" 
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 hover:text-primary transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">storefront</span>
                      Become a Vendor
                    </Link>
                  )}

                  <hr className="border-outline/50 my-2" />
                  
                  <button 
                    onClick={() => {
                      setDropdownOpen(false);
                      signOut({ callbackUrl: '/' });
                    }}
                    className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-red-500 hover:bg-red-50/50 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">logout</span>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link 
                href="/login" 
                className="text-xs font-bold text-gray-500 hover:text-primary transition-colors uppercase tracking-wider hidden sm:block"
              >
                Sign In
              </Link>
              <Link 
                href="/login"
                className="text-xs bg-primary text-white px-6 py-3 rounded-full hover:opacity-90 transition-all font-bold uppercase tracking-widest shadow-sm"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
