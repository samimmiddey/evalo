import CardLayout from "@/components/layouts/card-layout";

export const PayoutsSkeleton = () => {
   return (
      <div className="space-y-6">
         {/* Wallet Card Skeleton */}
         <CardLayout className="space-y-6 2xl:p-7 p-5 border-white/5!">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
               <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-zinc-800 animate-pulse border border-white/5 shrink-0" />
                  <div className="space-y-2">
                     <div className="h-3 w-32 bg-zinc-800/60 rounded animate-pulse" />
                     <div className="h-6 w-28 bg-zinc-800 rounded animate-pulse" />
                  </div>
               </div>
               <div className="h-10 max-sm:w-full w-38 bg-zinc-800 rounded-md animate-pulse shrink-0" />
            </div>

            {/* Quick Math Grid Bone */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-white/5">
               {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="p-3 rounded-xl bg-zinc-900/40 border border-white/5 space-y-1.5">
                     <div className="h-3 w-20 bg-zinc-800/60 rounded animate-pulse" />
                     <div className="h-4 w-28 bg-zinc-800/60 rounded animate-pulse" />
                  </div>
               ))}
            </div>
         </CardLayout>
      </div>
   );
};

export default PayoutsSkeleton;
