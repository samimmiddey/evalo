import CardLayout from "@/components/layouts/card-layout";

export const CheckoutSkeleton = () => {
   return (
      <div className="container s-margin px-4 md:px-6">
         {/* Navigation & Header Skeleton */}
         <div className="space-y-4 mb-8">
            {/* Back Button Skeleton */}
            <div className="h-5 w-28 rounded bg-zinc-800/60 animate-pulse" />

            <div className="max-w-2xl space-y-3">
               {/* Page Title */}
               <div className="h-8 2xl:h-9 w-36 rounded-lg bg-zinc-800 animate-pulse" />
               {/* Page Description */}
               <div className="h-4 w-full max-w-lg rounded bg-zinc-800/60 animate-pulse" />
            </div>
         </div>

         {/* 2-Column Responsive Layout: Plan on Left, Order Summary on Right */}
         <div className="grid grid-cols-1 lg:grid-cols-[7fr_5fr] gap-6 lg:gap-8 items-start">
            {/* Left Column: Plan Summary Card Skeleton */}
            <CardLayout className="space-y-6">
               {/* Plan Header */}
               <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-zinc-800/80">
                  <div className="space-y-2.5">
                     <div className="flex items-center gap-2.5">
                        <div className="h-7 w-36 rounded-md bg-zinc-800 animate-pulse" />
                        <div className="h-5 w-24 rounded-full bg-zinc-800/60 animate-pulse" />
                     </div>
                     <div className="h-4 w-72 max-w-full rounded bg-zinc-800/60 animate-pulse" />
                  </div>

                  <div className="sm:text-right shrink-0 space-y-1.5">
                     <div className="flex items-baseline sm:justify-end gap-1">
                        <div className="h-8 2xl:h-9 w-28 rounded-lg bg-zinc-800 animate-pulse" />
                        <div className="h-4 w-12 rounded bg-zinc-800/60 animate-pulse" />
                     </div>
                     <div className="h-3 w-32 rounded bg-zinc-800/60 animate-pulse" />
                  </div>
               </div>

               {/* Credits Quota Banner */}
               <div className="rounded-xl border border-white/5 bg-zinc-900/40 p-5 flex max-sm:flex-col sm:items-center gap-4">
                  <div className="size-10 2xl:size-11 shrink-0 rounded-xl bg-zinc-800 animate-pulse" />
                  <div className="space-y-1.5 w-full">
                     <div className="h-5 w-40 rounded bg-zinc-800 animate-pulse" />
                     <div className="h-3.5 w-64 max-w-full rounded bg-zinc-800/60 animate-pulse" />
                  </div>
               </div>

               {/* Features List */}
               <div className="space-y-3.5 pt-1">
                  <div className="h-3 w-44 rounded bg-zinc-800/60 animate-pulse" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                     {Array.from({ length: 6 }).map((_, idx) => (
                        <div key={idx} className="flex items-center gap-2.5">
                           <div className="size-4 rounded-full bg-zinc-800/70 shrink-0 animate-pulse" />
                           <div
                              className="h-3.5 rounded bg-zinc-800/60 animate-pulse"
                              style={{ width: `${60 + ((idx * 13) % 30)}%` }}
                           />
                        </div>
                     ))}
                  </div>
               </div>
            </CardLayout>

            {/* Right Column: Order Summary Card Skeleton */}
            <CardLayout className="space-y-6 lg:sticky lg:top-24">
               {/* Card Title */}
               <div className="pb-4 border-b border-zinc-800/80">
                  <div className="h-6 w-32 rounded bg-zinc-800 animate-pulse" />
               </div>

               {/* Line Items */}
               <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                     <div className="h-4 w-36 rounded bg-zinc-800/60 animate-pulse" />
                     <div className="h-4 w-16 rounded bg-zinc-800 animate-pulse" />
                  </div>
                  <div className="flex items-center justify-between">
                     <div className="h-4 w-32 rounded bg-zinc-800/60 animate-pulse" />
                     <div className="h-4 w-28 rounded bg-zinc-800/60 animate-pulse" />
                  </div>
                  <div className="flex items-center justify-between">
                     <div className="h-4 w-28 rounded bg-zinc-800/60 animate-pulse" />
                     <div className="h-4 w-16 rounded bg-zinc-800 animate-pulse" />
                  </div>
               </div>

               {/* Total Section */}
               <div className="pt-4 border-t border-zinc-800/80 space-y-1.5">
                  <div className="flex items-baseline justify-between">
                     <div className="h-5 w-28 rounded bg-zinc-800 animate-pulse" />
                     <div className="text-right space-y-1">
                        <div className="h-7 w-24 rounded bg-zinc-800 animate-pulse ml-auto" />
                        <div className="h-3 w-20 rounded bg-zinc-800/60 animate-pulse ml-auto" />
                     </div>
                  </div>
               </div>

               {/* Action Button & Subtext */}
               <div className="space-y-2.5">
                  <div className="w-full h-12 rounded-lg bg-zinc-800 animate-pulse" />
                  <div className="h-3 w-3/4 mx-auto rounded bg-zinc-800/60 animate-pulse" />
               </div>

               {/* Security Note */}
               <div className="pt-4 border-t border-zinc-800/60 flex justify-center">
                  <div className="h-3.5 w-44 rounded bg-zinc-800/60 animate-pulse" />
               </div>
            </CardLayout>
         </div>
      </div>
   );
};

export default CheckoutSkeleton;
