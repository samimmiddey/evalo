export const ProfileSkeleton = () => {
   return (
      <div className="space-y-6">
         <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-6 sm:p-8 space-y-6">
            {/* Header Bone */}
            <div className="flex items-start gap-2.5 pb-5 border-b border-white/5">
               <div className="w-8.5 h-8.5 rounded-lg bg-zinc-800 animate-pulse shrink-0 mt-0.5" />
               <div className="space-y-1.5">
                  <div className="h-4 w-52 bg-zinc-800 rounded animate-pulse" />
                  <div className="h-3 w-72 bg-zinc-800/60 rounded animate-pulse" />
               </div>
            </div>

            {/* Inputs Bones */}
            <div className="space-y-6">
               {/* 2-Col: Designation & Company */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                     <div className="h-3 w-32 bg-zinc-800/60 rounded animate-pulse" />
                     <div className="h-10 w-full bg-zinc-900 border border-white/10 rounded-md animate-pulse" />
                  </div>
                  <div className="space-y-2">
                     <div className="h-3 w-28 bg-zinc-800/60 rounded animate-pulse" />
                     <div className="h-10 w-full bg-zinc-900 border border-white/10 rounded-md animate-pulse" />
                  </div>
               </div>

               {/* 2-Col: Experience & Expertise Domains */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                     <div className="h-3 w-36 bg-zinc-800/60 rounded animate-pulse" />
                     <div className="h-10 w-full bg-zinc-900 border border-white/10 rounded-md animate-pulse" />
                  </div>
                  <div className="space-y-2">
                     <div className="h-3 w-44 bg-zinc-800/60 rounded animate-pulse" />
                     <div className="h-11 w-full bg-zinc-900 border border-white/15 rounded-lg animate-pulse" />
                  </div>
               </div>

               {/* Bio */}
               <div className="space-y-2">
                  <div className="h-3 w-36 bg-zinc-800/60 rounded animate-pulse" />
                  <div className="h-25 w-full bg-zinc-900 border border-white/10 rounded-md animate-pulse" />
               </div>

               {/* Save Button */}
               <div className="flex items-center justify-end pt-4 border-t border-white/5">
                  <div className="h-9 w-32 bg-zinc-800 rounded-lg animate-pulse" />
               </div>
            </div>
         </div>
      </div>
   );
};

export default ProfileSkeleton;
