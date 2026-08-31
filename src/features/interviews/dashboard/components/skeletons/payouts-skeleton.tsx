import CardLayout from "@/components/layouts/card-layout";

export const PayoutsSkeleton = () => {
   return (
      <div className="space-y-6">
         {/* Wallet Card Skeleton */}
         <CardLayout className="space-y-6 2xl:p-7 p-5">
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
                  <div key={i} className="p-3 rounded-xl bg-zinc-900/60 border border-white/5 space-y-1.5">
                     <div className="h-3 w-20 bg-zinc-800/50 rounded animate-pulse" />
                     <div className="h-4 w-28 bg-zinc-800/80 rounded animate-pulse" />
                  </div>
               ))}
            </div>
         </CardLayout>

         {/* Sub Tabs Bone */}
         <div className="space-y-4">
            <div className="bg-zinc-900 border border-white/10 h-10 p-1 gap-1.5 rounded-lg w-fit flex items-center">
               <div className="h-8 w-40 rounded-md bg-zinc-800/70 animate-pulse" />
               <div className="h-8 w-44 rounded-md bg-zinc-800/40 animate-pulse" />
            </div>

            {/* List Item Bones */}
            <div className="space-y-3">
               {Array.from({ length: 3 }).map((_, i) => (
                  <div
                     key={i}
                     className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-zinc-900/40 border border-white/5"
                  >
                     <div className="space-y-2 w-full sm:w-auto">
                        <div className="flex items-center gap-2.5">
                           <div className="h-4 w-16 bg-zinc-800 rounded animate-pulse" />
                           <div className="h-3 w-20 bg-zinc-800/50 rounded animate-pulse" />
                           <div className="h-5 w-20 bg-zinc-800/60 rounded-full animate-pulse" />
                        </div>
                        <div className="h-3 w-48 bg-zinc-800/40 rounded animate-pulse" />
                     </div>
                     <div className="space-y-1.5 sm:text-right">
                        <div className="h-3 w-36 bg-zinc-800/40 rounded animate-pulse" />
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
   );
};

export default PayoutsSkeleton;
