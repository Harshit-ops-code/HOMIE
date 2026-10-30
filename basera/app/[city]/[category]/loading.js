export default function Loading() {
  return (
    <div className="bg-[#faf9f6] min-h-screen animate-pulse">
      {/* Skeleton Header */}
      <div className="h-16 bg-white border-b border-zinc-200/50 flex items-center justify-between px-6">
        <div className="w-24 h-6 bg-zinc-200 rounded-full"></div>
        <div className="w-32 h-8 bg-zinc-200 rounded-full"></div>
      </div>

      {/* Main page layout */}
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row gap-6">
        {/* Skeleton Sidebar */}
        <div className="w-full md:w-68 h-96 bg-zinc-200 rounded-3xl shrink-0"></div>

        {/* Skeleton Content Grid */}
        <div className="flex-grow">
          {/* Controls Bar */}
          <div className="h-12 bg-zinc-200 rounded-2xl mb-6 w-full"></div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-80 bg-zinc-200 rounded-card"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
