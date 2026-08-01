import PrimaryBody from '@/components/common/primary-body';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Briefcase, Building2, Star } from 'lucide-react';
import { Interviewer } from '../types/explore.type';
import { getImage } from '@/utils/get-image';

interface InterviewerCardProps {
   interviewer: Interviewer;
}

const InterviwerCard = ({ interviewer }: InterviewerCardProps) => {
   return (
      <div
         key={interviewer.id}
         className="group relative flex flex-col bg-zinc-900/40 border border-white/5 rounded-2xl p-6 transition-all duration-300 hover:bg-zinc-900/80 hover:border-violet-500/30 hover:shadow-[0_0_30px_-5px_rgba(139,92,246,0.15)] overflow-hidden"
      >
         {/* Subtle glow effect on hover */}
         <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />

         <div className="flex items-start justify-between mb-4 relative z-10">
            <div className="flex items-center gap-4">
               <div className="relative h-14 w-14 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-violet-500/30 transition-colors bg-zinc-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                     src={getImage(interviewer.imageUrl)}
                     alt={`${interviewer.firstName} ${interviewer.lastName}`}
                     className="h-full w-full object-cover"
                  />
               </div>
               <div>
                  <h3 className="text-lg font-semibold text-zinc-100">
                     {interviewer.firstName} {interviewer.lastName}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                     <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                     <span className="text-sm font-medium text-zinc-300">{interviewer.totalRatings ?? '0'}</span>
                     <span className="text-xs text-zinc-500">({interviewer.averageRating ?? '0.0'})</span>
                  </div>
               </div>
            </div>
         </div>

         <div className="space-y-2.5 mb-4 2xl:mb-5 grow relative z-10">
            <div className="flex items-center gap-2 text-zinc-300 text-sm">
               <Briefcase className="w-4 h-4 text-violet-400 shrink-0" />
               <span className="font-medium truncate">{interviewer.designation}</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-400 text-sm">
               <Building2 className="w-4 h-4 text-violet-400 shrink-0" />
               <span className="truncate">{interviewer.company}</span>
               <span className="text-zinc-600">•</span>
               <span>{interviewer.experience}+ yrs exp</span>
            </div>
         </div>

         <PrimaryBody
            className="text-sm! mb-5 2xl:mb-6 line-clamp-2 leading-relaxed"
            text={interviewer.bio ?? "No bio available"}
         />

         <div className="flex flex-wrap gap-2 mb-4.5 2xl:mb-5 relative z-10">
            {interviewer.expertise.map((skill) => (
               <Badge
                  key={skill}
                  variant='outline'
                  className="px-2.5 py-3! rounded-md bg-white/5 text-zinc-300"
               >
                  {skill}
               </Badge>
            ))}
         </div>

         <Separator className="mb-4.5 2xl:mb-5 bg-white/5" />

         <Button
            variant='default'
            size='lg'
            className="w-full bg-violet-600 hover:bg-violet-700 text-zinc-100 border-0 transition-all"
         >
            View Profile
         </Button>
      </div>
   );
};

export default InterviwerCard;