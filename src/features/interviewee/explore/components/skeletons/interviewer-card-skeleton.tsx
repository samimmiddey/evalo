import React from 'react';
import { Separator } from '@/components/ui/separator';

const InterviewerCardSkeleton = () => {
   return (
      <div className="flex flex-col bg-zinc-900/40 border border-white/5 rounded-2xl p-6 overflow-hidden">
         <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4 w-full">
               <div className="relative h-12 2xl:h-14 w-12 2xl:w-14 rounded-full bg-zinc-800 animate-pulse shrink-0" />
               <div className="space-y-2 w-full">
                  <div className="h-4 bg-zinc-800 rounded-md animate-pulse w-32" />
                  <div className="h-4 bg-zinc-800 rounded-md animate-pulse w-16" />
               </div>
            </div>
         </div>

         <div className="space-y-2.5 mb-5 2xl:mb-6 grow">
            <div className="flex items-center gap-2">
               <div className="w-4 h-4 rounded bg-zinc-800 animate-pulse shrink-0" />
               <div className="h-4 bg-zinc-800 rounded-md animate-pulse w-48" />
            </div>
            <div className="flex items-center gap-2">
               <div className="w-4 h-4 rounded bg-zinc-800 animate-pulse shrink-0" />
               <div className="h-4 bg-zinc-800 rounded-md animate-pulse w-36" />
            </div>
         </div>

         <div className="space-y-2 mb-5 2xl:mb-6">
            <div className="h-3.5 bg-zinc-800 rounded-md animate-pulse w-full" />
            <div className="h-3.5 bg-zinc-800 rounded-md animate-pulse w-11/12" />
         </div>

         <div className="flex flex-wrap gap-2 mb-4.5 2xl:mb-5">
            {[1, 2, 3].map((i) => (
               <div key={i} className="h-6.5 2xl:h-7 w-20 bg-zinc-800 rounded-md animate-pulse" />
            ))}
         </div>

         <Separator className="mb-4.5 2xl:mb-5 bg-white/5" />

         <div className="h-8.5 2xl:h-9 w-full bg-zinc-800 rounded-md animate-pulse" />
      </div>
   );
};

export default InterviewerCardSkeleton;