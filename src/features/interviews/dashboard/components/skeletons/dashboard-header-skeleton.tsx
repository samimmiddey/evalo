export const DashboardHeaderSkeleton = () => {
   return (
      <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-white/5 animate-pulse">
         <div className="space-y-3">
            <div className="h-8 w-64 bg-zinc-800 rounded-lg" />
            <div className="h-4 w-96 bg-zinc-800/60 rounded-md" />
         </div>
         <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full md:w-auto">
            {Array.from({ length: 4 }).map((_, i) => (
               <div
                  key={i}
                  className="bg-zinc-900/40 border border-white/5 rounded-xl p-3.5 min-w-28 text-center space-y-2"
               >
                  <div className="h-3 w-16 bg-zinc-800/80 mx-auto rounded" />
                  <div className="h-6 w-12 bg-zinc-800 mx-auto rounded" />
               </div>
            ))}
         </div>
      </div>
   );
};
