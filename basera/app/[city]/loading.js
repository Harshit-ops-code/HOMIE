export default function Loading() {
  return (
    <div className="bg-[#faf9f6] min-h-screen animate-pulse">
      {/* Skeleton Navbar Header */}
      <div className="h-16 bg-white border-b border-zinc-200/50 flex items-center justify-between px-6">
        <div className="w-24 h-6 bg-zinc-200 rounded-full"></div>
        <div className="w-32 h-8 bg-zinc-200 rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col gap-8">
        {/* Skeleton Hero Banner */}
        <div className="h-64 sm:h-80 w-full bg-zinc-200 rounded-3xl"></div>

        {/* Skeleton Search & Checklist */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="h-14 bg-zinc-200 rounded-full"></div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-28 bg-zinc-200 rounded-2xl"></div>
              ))}
            </div>
          </div>
          <div className="h-72 bg-zinc-200 rounded-3xl"></div>
        </div>
      </div>
    </div>
  );
}
