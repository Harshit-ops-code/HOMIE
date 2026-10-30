'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function ErrorBoundary({ error, reset }) {
  useEffect(() => {
    console.error('Unhandled runtime error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-600/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-md w-full bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center shadow-2xl">
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
          <span className="material-symbols-outlined text-4xl">error_outline</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
          Something went wrong
        </h1>
        <p className="text-slate-400 text-sm sm:text-base mb-8 leading-relaxed">
          An unexpected error occurred while loading this view. You can retry or head back to safety.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-medium transition-all shadow-lg shadow-primary-600/25 min-h-[44px] cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">refresh</span>
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-all border border-white/10 min-h-[44px]"
          >
            <span className="material-symbols-outlined text-lg">home</span>
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
