'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';

export default function ProfilePage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="bg-surface min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Loading Profile...</p>
          </div>
        </main>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="bg-surface min-h-screen flex flex-col bg-pattern">
        <Navbar />
        <main className="flex-grow flex items-center justify-center p-6">
          <div className="bg-white border border-outline rounded-card p-10 max-w-sm w-full text-center flex flex-col items-center gap-6 shadow-sm">
            <span className="material-symbols-outlined text-[48px] text-gray-300">lock</span>
            <div>
              <h2 className="font-plus-jakarta text-lg font-bold text-primary mb-1">Access Restricted</h2>
              <p className="text-xs text-gray-500 font-semibold leading-relaxed">Please sign in to view your user profile details.</p>
            </div>
            <Link 
              href="/login"
              className="w-full bg-primary text-white py-3 rounded-full text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-all text-center"
            >
              Sign In Now
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-surface min-h-screen flex flex-col bg-pattern">
      <Navbar />
      
      <main className="flex-grow max-w-2xl w-full mx-auto px-6 py-16">
        <div className="bg-white border border-outline rounded-card p-8 sm:p-10 shadow-sm flex flex-col gap-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-outline/50">
            <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center font-plus-jakarta text-3xl font-bold uppercase border border-primary/20">
              {session.user?.name?.charAt(0) || 'U'}
            </div>
            <div className="text-center sm:text-left">
              <h1 className="font-plus-jakarta text-2xl font-extrabold text-primary tracking-tight">
                {session.user?.name}
              </h1>
              <p className="text-xs text-gray-500 font-semibold mt-0.5">{session.user?.email}</p>
              <div className="flex gap-2 justify-center sm:justify-start mt-3">
                <span className="text-[10px] bg-primary/10 text-primary px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                  Role: {session.user?.role || 'user'}
                </span>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="flex flex-col gap-5">
            <h3 className="font-plus-jakarta text-xs font-bold text-primary uppercase tracking-widest">Account Information</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-50/50 border border-outline p-4 rounded-xl">
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Email Status</p>
                <p className="text-xs font-bold text-primary mt-1">Verified</p>
              </div>

              <div className="bg-gray-50/50 border border-outline p-4 rounded-xl">
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Authentication Provider</p>
                <p className="text-xs font-bold text-primary mt-1">Credentials / Secure Provider</p>
              </div>
            </div>
          </div>

          {/* Dashboard links */}
          <div className="flex flex-col gap-4">
            <h3 className="font-plus-jakarta text-xs font-bold text-primary uppercase tracking-widest">Dashboards & Relocation</h3>
            
            <div className="flex flex-col gap-3">
              <Link 
                href="/saved"
                className="flex items-center justify-between p-4 bg-white border border-outline rounded-xl hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">bookmark</span>
                  <span className="text-xs font-bold text-gray-700">My Saved Listings</span>
                </div>
                <span className="material-symbols-outlined text-sm text-gray-400 group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
              </Link>

              {(session.user?.role === 'vendor' || session.user?.role === 'admin') ? (
                <Link 
                  href="/vendor/dashboard"
                  className="flex items-center justify-between p-4 bg-white border border-outline rounded-xl hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">dashboard</span>
                    <span className="text-xs font-bold text-gray-700">Vendor Dashboard</span>
                  </div>
                  <span className="material-symbols-outlined text-sm text-gray-400 group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
                </Link>
              ) : (
                <Link 
                  href="/onboard"
                  className="flex items-center justify-between p-4 bg-white border border-outline rounded-xl hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">storefront</span>
                    <span className="text-xs font-bold text-gray-700">Become a Verified Vendor</span>
                  </div>
                  <span className="material-symbols-outlined text-sm text-gray-400 group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
                </Link>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-6 border-t border-outline/50 flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="flex-grow bg-red-500 hover:opacity-95 text-white py-3.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all text-center cursor-pointer"
            >
              Sign Out
            </button>
            <Link
              href="/"
              className="flex-grow border border-outline text-gray-500 hover:bg-gray-50 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all text-center"
            >
              Go to Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
