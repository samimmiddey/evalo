import CardLayout from "@/components/layouts/card-layout";

export const BillingSkeleton = () => {
   return (
      <div className="space-y-6">
         {/* Top Cards Grid */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Plan Card Skeleton */}
            <div className="lg:col-span-2">
               <CardLayout className="space-y-6 2xl:p-7 p-5 border-white/5! h-full flex flex-col justify-between">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                     <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-zinc-800 animate-pulse border border-white/5 shrink-0" />
                        <div className="space-y-2">
                           <div className="h-3 w-28 bg-zinc-800/60 rounded animate-pulse" />
                           <div className="flex items-center gap-2">
                              <div className="h-6 w-32 bg-zinc-800 rounded animate-pulse" />
                              <div className="h-5 w-14 rounded-full bg-zinc-800/60 animate-pulse" />
                           </div>
                        </div>
                     </div>
                     <div className="h-9 max-sm:w-full w-28 bg-zinc-800 rounded-lg animate-pulse shrink-0" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-white/5">
                     {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="p-3 rounded-xl bg-zinc-900/40 border border-white/5 space-y-1.5">
                           <div className="h-3 w-20 bg-zinc-800/60 rounded animate-pulse" />
                           <div className="h-4 w-24 bg-zinc-800/60 rounded animate-pulse" />
                        </div>
                     ))}
                  </div>
               </CardLayout>
            </div>

            {/* Wallet Card Skeleton */}
            <div>
               <CardLayout className="h-full flex flex-col justify-between 2xl:p-7 p-5 border-white/5!">
                  <div className="flex items-start gap-4 justify-between pb-5">
                     <div className="space-y-2">
                        <div className="flex items-baseline gap-2.5">
                           <div className="h-10 w-20 bg-zinc-800 rounded-lg animate-pulse" />
                           <div className="h-4 w-28 bg-zinc-800/60 rounded animate-pulse" />
                        </div>
                        <div className="h-3 w-44 bg-zinc-800/60 rounded animate-pulse" />
                     </div>
                     <div className="w-10 h-10 rounded-xl bg-zinc-800 animate-pulse border border-white/5 shrink-0" />
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-900/40 border border-white/5 flex items-center justify-between">
                     <div className="h-3.5 w-24 bg-zinc-800/60 rounded animate-pulse" />
                     <div className="h-3.5 w-16 bg-zinc-800 rounded animate-pulse" />
                  </div>
               </CardLayout>
            </div>
         </div>
      </div>
   );
};

export default BillingSkeleton;
