import PrimaryBody from '@/components/common/primary-body';
import PrimaryTitle from '@/components/common/primary-title';
import CardLayout from '@/components/layouts/card-layout';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { interviewerDetailsData } from '@/data/explore/explore.data';
import { DetailedInterviewer } from '@/data/explore/explore.types';
import { Star, Briefcase, Coins } from 'lucide-react';
import HeaderTitle from './header-title';

interface InterviewerProps {
   interviewer: DetailedInterviewer;
};

const ProfileDetails = ({ interviewer }: InterviewerProps) => {
   return (
      <CardLayout>
         <div className="flex flex-col md:flex-row gap-5 2xl:gap-6 items-start relative z-10 mb-7 2xl:mb-10">
            <div className="relative h-24 lg:h-30 w-24 lg:w-30 2xl:h-36 2xl:w-36 rounded-2xl overflow-hidden border-2 border-zinc-300 shrink-0">
               {/* eslint-disable-next-line @next/next/no-img-element */}
               <img
                  src={interviewer.imageUrl || '/default-avatar.png'}
                  alt={`${interviewer.firstName} ${interviewer.lastName}`}
                  className="h-full w-full object-cover"
               />
            </div>

            <div className="space-y-4 grow">
               <div>
                  <div className="flex flex-wrap items-center gap-3">
                     <PrimaryTitle
                        className="text-2xl! 2xl:text-3xl! font-bold text-zinc-100"
                        text={`${interviewer.firstName} ${interviewer.lastName}`}
                     />
                     <Badge
                        variant="outline"
                        className="h-5.5 px-2 bg-violet-500/10 text-violet-300 border-violet-500/20"
                     >
                        Interviewer
                     </Badge>
                  </div>

                  <div className="font-medium mt-1 flex items-center gap-2">
                     <PrimaryBody className='text-sm! 2xl:text-base!' text={interviewer.designation ?? ''} />
                     <span className="text-zinc-600">•</span>
                     <PrimaryBody className='text-sm! 2xl:text-base!' text={interviewer.company ?? ''} />
                  </div>
               </div>

               <div className="flex flex-wrap gap-y-2 gap-x-6 text-sm text-zinc-400">
                  <div className="flex items-center gap-1.5">
                     <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                     <span className="font-semibold text-zinc-200">{interviewer.averageRating?.toFixed(1) || '0.0'}</span>
                     <span>({interviewer.totalRatings} ratings)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                     <Briefcase className="w-4 h-4 text-zinc-500" />
                     <span>{interviewer.experience}+ Years Experience</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                     <Coins className="w-4 h-4 text-violet-400" />
                     <span className="text-zinc-200 font-medium">{interviewerDetailsData.creditRate} Credit / session</span>
                  </div>
               </div>

               <div className="flex flex-wrap gap-2 pt-2">
                  {interviewer.expertise.map((skill) => (
                     <Badge
                        key={skill}
                        variant="outline"
                        className="bg-white/5 border-white/5 hover:border-violet-500/30 text-zinc-300 px-2.5 text-xs h-6"
                     >
                        {skill}
                     </Badge>
                  ))}
               </div>
            </div>
         </div>

         <Separator className='my-5 2xl:my-6 bg-zinc-400/10' />

         <div className="space-y-3 2xl:space-y-4">
            <HeaderTitle
               title={interviewerDetailsData.bio.title}
               icon={interviewerDetailsData.bio.icon}
            />
            <PrimaryBody
               className="leading-relaxed text-sm! 2xl:text-base!"
               text={interviewer.bio ?? ''}
            />
         </div>
      </CardLayout>
   );
};

export default ProfileDetails;