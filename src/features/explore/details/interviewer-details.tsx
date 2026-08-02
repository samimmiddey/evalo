'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
   ArrowLeft,
} from 'lucide-react';

import { interviewerDetailsData } from '@/data/explore/explore.data';
import ProfileDetails from './components/profile-details';
import UserTestimonials from './components/user-testimonials';
import BookingForm from './components/booking-form';

const InterviewerDetails = () => {
   const params = useParams();
   const interviewerId = params?.id as string;

   // Find interviewer by ID, fallback to first mock interviewer if not found or invalid
   const interviewer = interviewerDetailsData.find(i => i.id === interviewerId) || interviewerDetailsData[0];

   if (!interviewer) {
      return (
         <div className="container py-12 text-center">
            <h2 className="text-xl font-semibold text-zinc-200">Interviewer not found</h2>
            <Link href="/explore" className="mt-4 inline-flex items-center gap-2 text-violet-400 hover:underline">
               <ArrowLeft className="w-4 h-4" /> Back to Explore
            </Link>
         </div>
      );
   }

   return (
      <div className="container s-margin-t px-4 md:px-6 max-w-7xl mx-auto pb-16">
         {/* Navigation Link */}
         <Link
            href="/explore"
            className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-100 transition-colors mb-6 group"
         >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Explore
         </Link>

         <div className="grid grid-cols-1 lg:grid-cols-[7.5fr_4.5fr] gap-8 items-start">
            {/* LEFT COLUMN: Profile Details */}
            <div className="space-y-8">

               {/* Main Profile Header Card */}
               <ProfileDetails interviewer={interviewer} />

               {/* Testimonials Section */}
               <UserTestimonials interviewer={interviewer} />
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