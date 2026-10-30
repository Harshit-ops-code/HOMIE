export default function Loading() {
  return (
    <div className="bg-[#faf9f6] min-h-screen animate-pulse">
      {/* Skeleton Header */}
      <div className="h-16 bg-white border-b border-zinc-200/50 flex items-center justify-between px-6">
        <div className="w-24 h-6 bg-zinc-200 rounded-full"></div>
        <div className="flex gap-4">
          <div className="w-16 h-6 bg-zinc-200 rounded-full"></div>
          <div className="w-16 h-6 bg-zinc-200 rounded-full"></div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col gap-8">
        {/* Skeleton Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 h-[250px] md:h-[400px]">
          <div className="md:col-span-2 h-full bg-zinc-200 rounded-3xl"></div>
          <div className="hidden md:grid grid-cols-2 col-span-2 gap-3 h-full">
            <div className="h-[190px] bg-zinc-200 rounded-3xl"></div>
            <div className="h-[190px] bg-zinc-200 rounded-3xl"></div>
            <div className="h-[190px] bg-zinc-200 rounded-3xl"></div>
            <div className="h-[190px] bg-zinc-200 rounded-3xl"></div>
          </div>
        </div>

        {/* Skeleton Details & Sidebar */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-grow flex flex-col gap-6">
            <div className="flex flex-wrap items-center gap-3">
              <div className="w-48 h-8 bg-zinc-200 rounded-xl"></div>
              <div className="w-16 h-5 bg-zinc-200 rounded-full"></div>
            </div>
            <div className="w-32 h-4 bg-zinc-200 rounded-full"></div>

            {/* Skeleton Parameters */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
              <div className="h-20 bg-zinc-200 rounded-2xl"></div>
              <div className="h-20 bg-zinc-200 rounded-2xl"></div>
              <div className="h-20 bg-zinc-200 rounded-2xl"></div>
              <div className="h-20 bg-zinc-200 rounded-2xl"></div>
            </div>

            {/* Skeleton Description */}
            <div className="flex flex-col gap-2 mt-6">
              <div className="w-full h-4 bg-zinc-200 rounded-full"></div>
              <div className="w-full h-4 bg-zinc-200 rounded-full"></div>
              <div className="w-2/3 h-4 bg-zinc-200 rounded-full"></div>
            </div>
          </div>

          {/* Skeleton Sidebar Contact */}
          <div className="w-full lg:w-80 h-72 bg-zinc-200 rounded-3xl"></div>
        </div>
      </div>
    </div>
  );
}
