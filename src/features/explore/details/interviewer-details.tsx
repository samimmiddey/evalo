'use client';

import Link from 'next/link';
import { interviewerDetailsData } from '@/data/explore/explore.data';
import ProfileDetails from './components/profile-details';
import WhatToExpect from './components/what-to-expect';
import UserTestimonials from './components/user-testimonials';
import BookingForm from './components/booking-form';
import { InterviewerDetails as TInterviewerDetails } from './types/details.types';
import ScreenNoData from '@/components/common/screen-no-data';

const InterviewerDetails = ({ interviewer }: { interviewer: TInterviewerDetails; }) => {
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
               <ProfileDetails interviewer={interviewer} />

               {/* What to Expect Section */}
               <WhatToExpect currentPlan={interviewer.currentPlan} />

               {/* Testimonials Section */}
               <UserTestimonials />
            </div>

            {/* RIGHT COLUMN: Interactive Booking Form */}
            <div className="lg:sticky lg:top-22 space-y-6">
               <BookingForm interviewer={interviewer} />
            </div>
         </div>
      </div>
   );
};

export default InterviewerDetails;