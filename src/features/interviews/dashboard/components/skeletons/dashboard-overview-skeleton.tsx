import CardLayout from "@/components/layouts/card-layout";

export const DashboardOverviewSkeleton = () => {
   return (
      <div className="container s-margin space-y-6 2xl:space-y-7 animate-pulse">
         {/* Top Header Skeleton */}
         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-2">
               <div className="h-8 w-48 rounded-lg bg-zinc-800" />
               <div className="h-4 w-72 max-w-full rounded-md bg-zinc-800/60" />
            </div>
            <div className="h-9 w-36 rounded-lg bg-zinc-800 shrink-0" />
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
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 2xl:gap-7 items-start">
            {/* Left Column: Next Up Session Card Skeleton */}
            <div className="lg:col-span-2 space-y-6">
               <CardLayout className="p-5.5! space-y-5 bg-zinc-900/40! border-white/5! hover:shadow-none">
                  {/* Card Header */}
                  <div className="flex items-center justify-between">
                     <div className="h-5 w-40 rounded bg-zinc-800" />
                     <div className="h-6 w-24 rounded-full bg-zinc-800/60" />
                  </div>

                  {/* Counterpart & Details Box */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-white/2 border border-white/5">
                     <div className="flex items-center gap-3.5">
                        <div className="size-12 rounded-full bg-zinc-800 shrink-0" />
                        <div className="space-y-1.5">
                           <div className="h-4 w-32 rounded bg-zinc-800" />
                           <div className="h-3 w-44 rounded bg-zinc-800/50" />
                        </div>
                     </div>
                     <div className="h-8 w-44 rounded-lg bg-zinc-800/40" />
                  </div>

                  {/* Action Footer */}
                  <div className="flex items-center justify-between gap-3 pt-1">
                     <div className="h-4 w-28 rounded bg-zinc-800/50" />
                     <div className="h-9 w-32 rounded-lg bg-zinc-800" />
                  </div>
               </CardLayout>
            </div>

            {/* Right Column: Quick Actions Skeleton (2 Cards Symmetrical to Session Card) */}
            <div>
               <div className="grid grid-cols-1 gap-4 2xl:gap-5">
                  {Array.from({ length: 2 }).map((_, i) => (
                     <div
                        key={i}
                        className="p-5 rounded-xl bg-zinc-900/40 border border-white/5 flex items-start justify-between gap-3"
                     >
                        <div className="flex items-start gap-3.5">
                           <div className="size-8 rounded-lg bg-zinc-800 shrink-0" />
                           <div className="space-y-2">
                              <div className="h-4 w-36 rounded bg-zinc-800" />
                              <div className="h-4 w-52 max-w-full rounded bg-zinc-800/50" />
                              <div className="h-4 w-44 max-w-full rounded bg-zinc-800/50" />
                           </div>
                        </div>
                        <div className="size-4 rounded bg-zinc-800/40 shrink-0 mt-1" />
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
   );
};

export default DashboardOverviewSkeleton;
