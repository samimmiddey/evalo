export const PricingSkeleton = () => {
   return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-7 2xl:gap-8 mx-auto w-full lg:max-w-6xl 2xl:max-w-7xl lg:pt-6 pb-10">
         {Array.from({ length: 3 }).map((_, i) => {
            const isMiddle = i === 1;

            return (
               <div
                  key={i}
                  className={`relative flex flex-col h-full rounded-3xl bg-zinc-900/40 border border-white/5 transition-all p-7 lg:p-7.5 2xl:p-9 ${isMiddle
                     ? 'scale-100 lg:scale-105 z-10'
                     : 'mt-0 lg:mt-4'
                     }`}
               >
                  {/* Plan Name */}
                  <div className="h-6 w-28 rounded-md bg-zinc-800 mb-2.5 2xl:mb-3" />

                  {/* Plan Description */}
                  <div className="h-4 w-4/5 rounded bg-zinc-800/60 mb-5 2xl:mb-6" />

                  {/* Price Block */}
                  <div className="flex items-end gap-1.5 mb-7 2xl:mb-8">
                     <div className="h-9 2xl:h-10 w-28 rounded-lg bg-zinc-800" />
                     <div className="h-4 w-12 rounded bg-zinc-800/60 mb-1" />
                  </div>

                  {/* Button */}
                  <div className="w-full h-11 2xl:h-12 rounded-xl mb-7 2xl:mb-8 bg-white/5" />

                  {/* Feature List Skeleton */}
                  <div className="space-y-4 pt-1">
                     <div className="h-3.5 w-32 rounded bg-zinc-800/60 mb-4" />

                     {Array.from({ length: isMiddle ? 5 : 4 }).map((_, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                           <div className="size-4 rounded-full bg-zinc-800 shrink-0" />
                           <div
                              className="h-3.5 rounded bg-zinc-800/60"
                              style={{ width: `${65 + ((idx * 17) % 30)}%` }}
                           />
                        </div>
                     ))}
                  </div>
               </div>
            );
         })}
      </div>
   );
};

export default PricingSkeleton;
