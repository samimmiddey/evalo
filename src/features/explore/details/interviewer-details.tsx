import Link from 'next/link';
import { interviewerDetailsData } from '@/data/explore/explore.data';
import UserProfile from './components/user-profile';
import WhatToExpect from './components/what-to-expect';
import UserFeedback from './components/user-feedback';
import BookingForm from './components/booking-form';
import { InterviewerDetails as TInterviewerDetails, InterviewerFeedback } from './types/details.types';
import ScreenNoData from '@/components/common/screen-no-data';
import GradientWrapper from '@/components/wrappers/gradient-wrapper';
import NoDataCard from '@/components/common/no-data-card';

interface InterviewerDetailsProps {
   interviewer: TInterviewerDetails;
   feedback: InterviewerFeedback;
}

const InterviewerDetails = ({ interviewer, feedback }: InterviewerDetailsProps) => {
   if (!interviewer) {
      return (
         <ScreenNoData text='No interviewer found' />
      );
   }

   return (
      <div className="container s-margin-t px-4 md:px-6 max-w-7xl mx-auto">
         {/* Navigation Link */}
         <Link
            href="/explore"
            className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-100 transition-colors mb-6 group"
         >
            <interviewerDetailsData.backBtn.icon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            {interviewerDetailsData.backBtn.title}
         </Link>

         <div className="grid grid-cols-1 lg:grid-cols-[7.5fr_4.5fr] gap-5 lg:gap-6 2xl:gap-8 items-start">
            {/* LEFT COLUMN: Profile Details */}
            <div className="space-y-5 2xl:space-y-6">

               {/* Main Profile Header Card */}
               <UserProfile interviewer={interviewer} />

               {/* What to Expect Section */}
               <WhatToExpect currentPlan={interviewer.currentPlan} />

               {/* Testimonials Section */}
               <UserFeedback feedback={feedback} />
            </div>

            {/* RIGHT COLUMN: Interactive Booking Form */}
            <div className="lg:sticky lg:top-22 space-y-6">
               {
                  interviewer.availabilities.length === 0 ? (
                     <GradientWrapper
                        className="h-auto relative rounded-2xl shadow-2xl min-h-auto transition-all duration-300 border border-white/5 hover:border-violet-500/30 hover:shadow-[0_0_30px_-5px_rgba(139,92,246,0.15)]"
                        showGrid={false}
                     >
                        <div className="min-h-30 2xl:h-40 flex items-center justify-center">
                           <NoDataCard
                              text='No available slots'
                              className='w-full bg-transparent border-transparent flex-col'
                              iconClassName='size-6'
                           />
                        </div>
                     </GradientWrapper>
                  ) : (
                     <BookingForm interviewer={interviewer} />
                  )
               }
            </div>
         </div>
      </div>
   );
};

export default InterviewerDetails;