import React from 'react';
import CardLayout from '@/components/layouts/card-layout';
import { Separator } from '@/components/ui/separator';

const InterviewerCardSkeleton = () => {
   return (
      <CardLayout className="flex flex-col p-6!">
         {/* Top Header: Avatar + Name & Rating */}
         <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
               {/* 56px Avatar (h-14 w-14) */}
               <div className="h-14 w-14 rounded-full bg-zinc-800/80 border-2 border-white/5 animate-pulse shrink-0" />
               <div>
                  {/* Name */}
                  <div className="h-5 bg-zinc-800/80 rounded-md animate-pulse w-36 mb-1.5" />
                  {/* Rating */}
                  <div className="flex items-center gap-1.5 mt-0.5">
                     <div className="w-4 h-4 rounded bg-zinc-800/80 animate-pulse shrink-0" />
                     <div className="h-4 bg-zinc-800/80 rounded-md animate-pulse w-14" />
                  </div>
               </div>
            </div>
         </div>

         {/* Meta Details: Designation, Company, Experience */}
         <div className="space-y-2.5 mb-6 2xl:mb-7 grow">
            {/* Designation */}
            <div className="flex items-center gap-2">
               <div className="w-4 h-4 rounded bg-zinc-800/80 animate-pulse shrink-0" />
               <div className="h-4 bg-zinc-800/80 rounded-md animate-pulse w-44" />
            </div>
            {/* Company */}
            <div className="flex items-center gap-2">
               <div className="w-4 h-4 rounded bg-zinc-800/80 animate-pulse shrink-0" />
               <div className="h-4 bg-zinc-800/80 rounded-md animate-pulse w-32" />
            </div>
            {/* Experience */}
            <div className="flex items-center gap-2">
               <div className="w-4 h-4 rounded bg-zinc-800/80 animate-pulse shrink-0" />
               <div className="h-4 bg-zinc-800/80 rounded-md animate-pulse w-40" />
            </div>
         </div>

         {/* Bio snippet (2 lines) */}
         <div className="space-y-2 mb-6 2xl:mb-7">
            <div className="h-4 bg-zinc-800/80 rounded-md animate-pulse w-full" />
            <div className="h-4 bg-zinc-800/80 rounded-md animate-pulse w-4/5" />
         </div>

         {/* Skill Badges */}
         <div className="flex flex-wrap gap-2 mb-4.5 2xl:mb-5">
            <div className="h-7 w-20 bg-zinc-800/80 rounded-md animate-pulse" />
            <div className="h-7 w-24 bg-zinc-800/80 rounded-md animate-pulse" />
            <div className="h-7 w-16 bg-zinc-800/80 rounded-md animate-pulse" />
         </div>

         <Separator className="mb-4.5 2xl:mb-5 bg-white/5" />

         {/* View Profile Button (size lg = h-9) */}
         <div className="h-9 w-full bg-zinc-800/80 rounded-lg animate-pulse" />
      </CardLayout>
   );
};

export default InterviewerCardSkeleton;