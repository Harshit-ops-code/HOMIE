import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative gradient blur background */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-accent-purple/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-md w-full bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center shadow-2xl">
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center text-primary-400">
          <span className="material-symbols-outlined text-4xl">travel_explore</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
          Page Not Found
        </h1>
        <p className="text-slate-400 text-sm sm:text-base mb-8 leading-relaxed">
          The property, service, or destination you are looking for does not exist or has been relocated.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-medium transition-all shadow-lg shadow-primary-600/25 min-h-[44px]"
          >
            <span className="material-symbols-outlined text-lg">home</span>
            Return Home
          </Link>
          <Link
            href="/onboard"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-all border border-white/10 min-h-[44px]"
          >
            <span className="material-symbols-outlined text-lg">location_city</span>
            Choose City
          </Link>
        </div>
      </div>
    </div>
  );
}
