import CardLayout from '@/components/layouts/card-layout';
import { ViewType } from '@/types/ui.types';

interface InterviewCardSkeletonProps {
   view?: ViewType;
}

const InterviewCardSkeleton = ({ view = 'list' }: InterviewCardSkeletonProps) => {
   return (
      <CardLayout className="max-sm:p-0!">
         {/* Layout container matching view structure */}
         <div className={`flex w-full ${view === 'grid' ? 'flex-col' : 'flex-col lg:flex-row lg:items-stretch'}`}>

            {/* Left Side: Interviewer Identity Skeleton */}
            <div className={`flex-1 p-6 2xl:p-7 flex flex-col md:flex-row md:items-start gap-5 border-white/5 ${view === 'grid' ? 'border-b' : 'lg:border-r border-b lg:border-b-0'}`}>
               {/* Avatar Bone */}
               <div className="w-16 md:w-20 relative shrink-0">
                  <div className="h-16 w-16 md:h-20 md:w-20 rounded-2xl bg-zinc-800 border border-white/5 shadow-xl animate-pulse" />
               </div>

               {/* Bio/Expertise Bone */}
               <div className="space-y-3.5 grow w-full">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                     <div className="space-y-2 w-full max-w-50">
                        {/* Name */}
                        <div className="h-5 w-4/5 bg-zinc-800 rounded-md animate-pulse" />
                        {/* Designation & Company */}
                        <div className="h-4 w-11/12 bg-zinc-800/60 rounded-md animate-pulse" />
                     </div>
                  </div>

                  {/* Experience text */}
                  <div className="h-3 w-1/3 bg-zinc-800/40 rounded-md animate-pulse" />

                  {/* Expertise Badges */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                     <div className="h-8 w-20 bg-zinc-800/60 rounded-lg animate-pulse" />
                     <div className="h-8 w-24 bg-zinc-800/60 rounded-lg animate-pulse" />
                     <div className="h-8 w-16 bg-zinc-800/60 rounded-lg animate-pulse" />
                  </div>
               </div>
            </div>

            {/* Right Side: Schedule & Actions Skeleton */}
            <div className="flex-[1.25] flex flex-col justify-between">

               {/* Top Row: Schedule Bone */}
               <div className="p-6 2xl:p-7 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between flex-wrap gap-4 bg-zinc-900/10">
                  <div className="flex justify-between md:items-center flex-wrap max-md:gap-x-5 max-md:gap-y-4 md:gap-7 w-full md:w-auto">
                     {/* Date */}
                     <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded bg-zinc-800 animate-pulse" />
                        <div className="h-4 w-24 bg-zinc-800/80 rounded animate-pulse" />
                     </div>
                     {/* Time */}
                     <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded bg-zinc-800 animate-pulse" />
                        <div className="h-4 w-32 bg-zinc-800/80 rounded animate-pulse" />
                     </div>
                     {/* Duration */}
                     <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded bg-zinc-800 animate-pulse" />
                        <div className="h-4 w-16 bg-zinc-800/80 rounded animate-pulse" />
                     </div>
                  </div>

                  {/* Status Badge Bone */}
                  <div className="h-6 w-24 rounded-full bg-zinc-800 hidden md:block animate-pulse" />
               </div>

               {/* Guidelines Skeleton */}
               <div className="p-6 2xl:p-7 border-b border-white/5 bg-zinc-900/10">
                  <div className="flex max-sm:flex-col items-start gap-3.5">
                     {/* Icon Bone */}
                     <div className="h-8 w-8 rounded-lg bg-zinc-800 border border-white/5 shrink-0 animate-pulse" />
                     <div className="space-y-4 grow w-full">
                        {/* Header Bone */}
                        <div className="h-4 w-28 bg-zinc-800 rounded animate-pulse" />
                        {/* Body Text Bones */}
                        <div className="space-y-3 w-full">
                           <div className="h-3 w-full bg-zinc-800/60 rounded animate-pulse" />
                           <div className="h-3 w-11/12 bg-zinc-800/60 rounded animate-pulse" />
                           <div className="h-3 w-4/5 bg-zinc-800/60 rounded animate-pulse" />
                        </div>
                     </div>
                  </div>
               </div>

               {/* Bottom Row / Actions Bone */}
               <div className="p-6 2xl:p-7 flex flex-wrap items-center justify-end gap-2.5 2xl:gap-3">
                  <div className="h-9 w-28 bg-zinc-800/40 rounded-lg animate-pulse" />
                  <div className="h-9 w-36 bg-zinc-800 rounded-lg animate-pulse" />
               </div>

            </div>

         </div>
      </CardLayout>
   );
};

export default InterviewCardSkeleton;