interface FeedbackSkeletonLoaderProps {
   count?: number;
}

export const FeedbackSkeletonLoader = ({ count = 3 }: FeedbackSkeletonLoaderProps) => {
   return (
      <div className="space-y-4">
         {Array.from({ length: count }).map((_, index) => (
            <div
               key={index}
               className="p-4 rounded-xl bg-zinc-900 border border-white/5 space-y-3 animate-pulse"
            >
               {/* Reviewer identity & stars */}
               <div className="flex items-center justify-between">
                  <div className="space-y-1.5">
                     <div className="h-4 w-32 bg-zinc-800 rounded" />
                     <div className="h-3 w-24 bg-zinc-800/60 rounded" />
                  </div>
                  <div className="flex items-center gap-1">
                     {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="size-3.5 bg-zinc-800 rounded" />
                     ))}
                  </div>
               </div>

               {/* Feedback text */}
               <div className="space-y-1.5">
                  <div className="h-3.5 w-full bg-zinc-800/80 rounded" />
                  <div className="h-3.5 w-4/5 bg-zinc-800/80 rounded" />
               </div>

               {/* Date */}
               <div className="h-2.5 w-20 bg-zinc-800/50 rounded" />
            </div>
         ))}
      </div>
   );
};

export default FeedbackSkeletonLoader;
