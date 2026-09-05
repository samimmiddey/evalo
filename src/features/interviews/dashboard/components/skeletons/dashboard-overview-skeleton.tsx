import CardLayout from "@/components/layouts/card-layout";

export const DashboardOverviewSkeleton = () => {
   return (
      <div className="container s-margin space-y-7 2xl:space-y-8 animate-pulse">
         {/* Top Header Skeleton */}
         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-2">
               <div className="h-8 w-48 rounded-lg bg-zinc-800" />
               <div className="h-4 w-72 max-w-full rounded-md bg-zinc-800/60" />
            </div>
            <div className="h-10 w-36 rounded-lg bg-zinc-800 shrink-0" />
         </div>

         {/* 4 Stats Cards Grid */}
         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 2xl:gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
               <CardLayout
                  key={i}
                  className="p-5! space-y-3 bg-zinc-900/40! border-white/5! hover:shadow-none"
               >
                  <div className="flex items-center justify-between">
                     <div className="h-3.5 w-24 rounded bg-zinc-800" />
                     <div className="size-8 rounded-lg bg-zinc-800" />
                  </div>
                  <div className="h-7 w-16 rounded-md bg-zinc-800" />
                  <div className="h-3 w-28 rounded bg-zinc-800/50" />
               </CardLayout>
            ))}
         </div>

         {/* 2-Column Content Grid Skeleton */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 2xl:gap-7">
            {/* Left Column (Span 2) */}
            <div className="lg:col-span-2 space-y-6">
               <CardLayout className="p-6! space-y-4 bg-zinc-900/40! border-white/5! hover:shadow-none min-h-60">
                  <div className="h-5 w-40 rounded bg-zinc-800" />
                  <div className="h-20 w-full rounded-xl bg-zinc-800/40" />
                  <div className="h-10 w-32 rounded-lg bg-zinc-800" />
               </CardLayout>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
               <CardLayout className="p-6! space-y-4 bg-zinc-900/40! border-white/5! hover:shadow-none min-h-60">
                  <div className="h-5 w-36 rounded bg-zinc-800" />
                  <div className="space-y-2.5">
                     <div className="h-12 w-full rounded-lg bg-zinc-800/40" />
                     <div className="h-12 w-full rounded-lg bg-zinc-800/40" />
                  </div>
               </CardLayout>
            </div>
         </div>
      </div>
   );
};

export default DashboardOverviewSkeleton;
