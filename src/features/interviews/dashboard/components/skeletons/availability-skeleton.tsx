import CardLayout from "@/components/layouts/card-layout";

export const AvailabilitySkeleton = () => {
   return (
      <div className="space-y-6">
         {Array.from({ length: 2 }).map((_, groupIdx) => (
            <CardLayout
               key={groupIdx}
               className="p-5! space-y-4"
            >
               {/* Date Group Header Bone */}
               <div className="flex items-center justify-between gap-2 border-b border-white/5 pb-3">
                  <div className="flex items-center gap-2">
                     <div className="w-4 h-4 rounded bg-zinc-800 animate-pulse shrink-0" />
                     <div className="h-4 w-16 bg-zinc-800 rounded animate-pulse" />
                     <div className="h-3 w-28 bg-zinc-800/60 rounded animate-pulse" />
                  </div>
                  <div className="h-5 w-14 bg-zinc-800/60 rounded-full animate-pulse" />
               </div>

               {/* Slots Grid Bone */}
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3">
                  {Array.from({ length: groupIdx === 0 ? 4 : 3 }).map((_, slotIdx) => (
                     <div
                        key={slotIdx}
                        className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-zinc-900/50 border border-white/5"
                     >
                        <div className="flex items-center gap-2.5">
                           <div className="w-4 h-4 rounded bg-zinc-800 animate-pulse shrink-0" />
                           <div className="h-3.5 w-32 bg-zinc-800/80 rounded animate-pulse" />
                        </div>
                        <div className="w-7 h-7 rounded-lg bg-zinc-800/40 animate-pulse shrink-0" />
                     </div>
                  ))}
               </div>
            </CardLayout>
         ))}
      </div>
   );
};

export default AvailabilitySkeleton;
