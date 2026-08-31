import CardLayout from '@/components/layouts/card-layout';
import { Briefcase, Building2, Calendar, Clock, FileText, Hourglass, Info, NotebookText, Play, Star, Video } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Feedback, Interview } from '../types/appointments.types';
import { differenceInMinutes, format } from 'date-fns';
import { appointsData } from '@/data/appointments/appointments.data';
import { ViewType } from '@/types/ui.types';
import Link from 'next/link';
import { useMutation } from '@/hooks/use-mutation';
import { cancelBooking, retryStreamCall } from '../services/appointments.client.service';
import { toast } from 'sonner';
import { useEffect } from 'react';
import CustomSpinner from '@/components/common/custom-spinner';
import Image from 'next/image';

interface AppointmentCardProps {
   appointment: Interview;
   view: ViewType;
   onViewFeedback?: (feedbackId: string, feedback: Feedback) => void;
   refetchInterviewList: () => void;
}

const AppointmentCard = ({ appointment, view, onViewFeedback, refetchInterviewList }: AppointmentCardProps) => {
   const { interviewer, startTime, endTime, status, feedback, streamCallId, recordingUrl } = appointment;

   // Retry Stream Call
   const {
      isPending: isRetryPending,
      error: retryError,
      mutate: retryMutation
   } = useMutation(() =>
      retryStreamCall(appointment.id)
   );

   // Cancel Stream Call
   const {
      isPending: isCancelPending,
      error: cancelError,
      mutate: cancelMutation } =
      useMutation(() =>
         cancelBooking(appointment.id)
      );

   // Handle retry call
   const handleRetryStreamCall = async () => {
      const res = await retryMutation();

      if (res) {
         toast.success('Booking prepared successfully');
         refetchInterviewList();
      }
   };

   // Handle cancel / refund call
   const handleCancelBooking = async (isRefund = false) => {
      const res = await cancelMutation();

      if (res?.success) {
         toast.success(
            isRefund
               ? 'Session refunded successfully. Credits returned to your account.'
               : 'Booking cancelled successfully'
         );
         refetchInterviewList();
      }
   };

   // Handle mutation errors
   useEffect(() => {
      if (retryError) {
         toast.error(retryError);
      }
      if (cancelError) {
         toast.error(cancelError);
      }
   }, [retryError, cancelError]);

   const isExpired = status === 'SCHEDULED' && new Date() > new Date(endTime);

   // Status Badge Helper
   const renderStatusBadge = (status: Interview['status']) => {
      if (status === 'SCHEDULED' && isExpired) {
         return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-zinc-500/10 text-zinc-400 border border-white/10">
               <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
               Expired
            </span>
         );
      }

      switch (status) {
         case 'SCHEDULED':
            return (
               <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                  Scheduled
               </span>
            );
         case 'COMPLETED':
            return (
               <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Completed
               </span>
            );
         case 'CANCELLED':
            return (
               <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-zinc-500/10 text-red-400 border border-white/10">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                  Cancelled
               </span>
            );
      }
   };

   // Performance Color Helper
   const getPerformanceLevelColor = (level: string) => {
      const upper = level?.toUpperCase() || '';
      if (upper === 'OUTSTANDING' || upper === 'EXCELLENT') {
         return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
      }
      if (upper === 'GOOD') {
         return 'text-blue-400 border-blue-500/30 bg-blue-500/10';
      }
      if (upper === 'AVERAGE') {
         return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
      }
      if (upper === 'POOR') {
         return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
      }
      return 'text-zinc-400 border-white/10 bg-zinc-500/10';
   };

   return (
      <CardLayout className='max-sm:p-0!'>
         {/* Horizontal Card for Desktop, Stacked for Mobile */}
         <div className={`flex w-full ${view === 'grid' ? 'flex-col' : 'flex-col lg:flex-row lg:items-stretch'}`}>

            {/* Left Side: Interviewer Identity */}
            <div className={`flex-1 p-6 2xl:p-7 flex flex-col md:flex-row md:items-start gap-5 border-white/5 ${view === 'grid' ? 'border-b' : 'lg:border-r border-b lg:border-b-0'}`}>
               <div className="w-16 md:w-20 relative shrink-0">
                  <div className="relative h-16 w-16 md:h-20 md:w-20 rounded-2xl overflow-hidden border border-white/10 group-hover:border-violet-500/25 transition-colors bg-zinc-900 shadow-xl">
                     <Image
                        src={interviewer.imageUrl ?? '/user.png'}
                        alt={`${interviewer.firstName ?? ''} ${interviewer.lastName ?? ''}`}
                        fill
                        className="object-cover scale-100 group-hover:scale-105 transition-transform duration-500"
                        unoptimized
                     />
                  </div>

                  {/* Overall mini-rating badge */}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-zinc-950 border border-white/10 text-amber-400 shadow-md">
                     <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                     <span>{interviewer.averageRating ?? 0.0}</span>
                  </div>
               </div>

               <div className="space-y-2 grow">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                     <div>
                        <h4 className="text-lg font-bold text-zinc-100 group-hover:text-violet-400 transition-colors font-outfit">
                           {interviewer.firstName} {interviewer.lastName}
                        </h4>

                        <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-zinc-400">
                           <span className="flex items-center gap-1.5">
                              <Briefcase className="w-3.5 h-3.5 text-violet-400/80" />
                              {interviewer.designation}
                           </span>
                           <span className="text-zinc-700">•</span>
                           <span className="flex items-center gap-1.5">
                              <Building2 className="w-3.5 h-3.5 text-violet-400/80" />
                              {interviewer.company}
                           </span>
                        </div>
                     </div>

                     {/* Status Badge (visible on mobile next to title) */}
                     <div className="md:hidden">
                        {renderStatusBadge(status)}
                     </div>
                  </div>

                  <p className="text-xs text-zinc-500 font-medium">
                     {interviewer.experience} years experience
                  </p>

                  {/* Expertise Badges */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                     {interviewer?.expertise?.map((skill) => (
                        <Badge
                           key={skill}
                           variant="outline"
                           className="bg-zinc-900 border-white/10 text-zinc-400 shrink-0 p-3 cursor-pointer transition-colors font-medium"
                        >
                           {skill}
                        </Badge>
                     ))}
                  </div>
               </div>
            </div>

            {/* Right Side: Schedule, Actions & AI Feedback details */}
            <div className="flex-[1.25] flex flex-col justify-between">

               {/* Top Row of Right: Status & Schedule (hidden status on mobile as it is above) */}
               <div className="p-6 2xl:p-7 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between flex-wrap gap-4 bg-zinc-900/10">

                  {/* Schedule info */}
                  <div className="flex justify-between md:items-center flex-wrap max-md:gap-x-5 max-md:gap-y-4 md:gap-7 text-zinc-300">
                     <div className="flex flex-col md:flex-row items-center gap-2">
                        <Calendar className="w-4 h-4 text-violet-400 shrink-0" />
                        <div className="text-center md:text-left">
                           <span className="block text-[10px] uppercase text-zinc-500 font-semibold tracking-wider md:hidden">Date</span>
                           <span className="text-xs 2xl:text-sm font-semibold text-zinc-200">{format(new Date(startTime), 'MMM d, yyyy')}</span>
                        </div>
                     </div>

                     <div className="flex flex-col md:flex-row items-center gap-2">
                        <Clock className="w-4 h-4 text-violet-400 shrink-0" />
                        <div className="text-center md:text-left">
                           <span className="block text-[10px] uppercase text-zinc-500 font-semibold tracking-wider md:hidden">Time</span>
                           <span className="text-xs 2xl:text-sm font-medium text-zinc-300">
                              {format(new Date(startTime), 'h:mm a')}
                              {' - '}
                              {format(new Date(endTime), 'h:mm a')}
                           </span>
                        </div>
                     </div>

                     <div className="flex flex-col md:flex-row items-center gap-2">
                        <Hourglass className="w-4 h-4 text-violet-400 shrink-0" />
                        <div className="text-center md:text-left">
                           <span className="block text-[10px] uppercase text-zinc-500 font-semibold tracking-wider md:hidden">Duration</span>
                           <span className="text-xs 2xl:text-sm font-semibold text-zinc-300">{differenceInMinutes(
                              new Date(endTime),
                              new Date(startTime)
                           )} mins</span>
                        </div>
                     </div>
                  </div>

                  {/* Status Badge (desktop) */}
                  <div className="hidden md:block">
                     {renderStatusBadge(status)}
                  </div>
               </div>

               {/* Guidelines */}
               {
                  status === 'SCHEDULED' && !isExpired && (
                     <div className="p-6 2xl:p-7 border-b border-white/5">
                        <div className="flex max-sm:flex-col items-start gap-3.5">
                           <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 shadow-sm shrink-0 max-sm:mb-1">
                              <Info className="w-4 h-4" />
                           </div>
                           <div>
                              <span className="text-xs font-bold text-amber-100 uppercase tracking-widest">
                                 {appointsData.helpfulTips.header}
                              </span>
                              <p className="text-sm text-amber-200/80 leading-relaxed mt-2">
                                 {appointsData.helpfulTips.body}
                              </p>
                           </div>
                        </div>
                     </div>
                  )
               }

               {/* Bottom Row: AI Feedback summary (Only for COMPLETED) */}
               {status === 'COMPLETED' && feedback && (
                  <div className="p-6 2xl:p-7 border-b border-white/5">
                     <div className="flex max-sm:flex-col items-start gap-3.5">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-400 shadow-sm shrink-0 max-sm:mb-1">
                           <NotebookText className="w-4 h-4" />
                        </div>

                        <div className="space-y-3.5 w-full">
                           <div>
                              <span className="text-xs font-bold text-violet-300 uppercase tracking-widest">
                                 AI Feedback Evaluation
                              </span>
                              <p className="text-sm text-zinc-300 leading-relaxed mt-2">
                                 {feedback.summary}
                              </p>
                           </div>

                           {/* Performance and Overall Score indicators */}
                           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3.5 border-t border-white/5">
                              <div className="flex flex-wrap justify-between items-center gap-4 w-full">
                                 <div className="flex items-center gap-2">
                                    <span className="text-xs text-zinc-500">Performance:</span>
                                    <span className={`text-xs px-2.5 py-0.5 rounded-full border font-bold ${getPerformanceLevelColor(feedback.overallRating)}`}>
                                       {feedback.overallRating}
                                    </span>
                                 </div>

                                 <div className="flex items-center gap-2.5">
                                    <span className="text-xs text-zinc-500">Overall Score:</span>
                                    <div className="flex items-center gap-2">
                                       <div className="h-2 w-20 bg-zinc-800 rounded-full overflow-hidden">
                                          <div
                                             className="h-full bg-linear-to-r from-violet-500 to-indigo-500 rounded-full"
                                             style={{ width: `${(Number(feedback.sessionRating) / 5) * 100}%` }}
                                          />
                                       </div>
                                       <span className="text-xs font-bold text-zinc-200 font-outfit">{(Number(feedback.sessionRating) / 5) * 100}/100</span>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               )}

               {/* Actions Area */}
               <div className="p-6 2xl:p-7 flex max-sm:flex-col sm:flex-wrap sm:items-center sm:justify-end gap-2.5 2xl:gap-3">

                  {status === 'SCHEDULED' && isExpired && (
                     <>
                        <Button
                           variant="ghost"
                           className="cursor-pointer text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 text-xs rounded-lg h-9 max-sm:w-full"
                           onClick={() => void handleCancelBooking(true)}
                           disabled={isCancelPending}
                        >
                           {isCancelPending ? <CustomSpinner text="Refunding..." /> : "Claim Refund"}
                        </Button>
                        <Link href={`/interviewers/${appointment.interviewer.id}`}>
                           <Button className="cursor-pointer bg-violet-600/90 hover:bg-violet-600 text-zinc-100 text-xs rounded-lg h-9 px-4.5 font-semibold flex items-center gap-1.5 max-sm:w-full">
                              Book Again
                           </Button>
                        </Link>
                     </>
                  )}

                  {status === 'SCHEDULED' && !isExpired && (
                     <>
                        <Button
                           variant="ghost"
                           className="cursor-pointer text-zinc-400 hover:text-rose-400 hover:bg-rose-500/5 text-xs rounded-lg h-9 max-sm:w-full"
                           onClick={() => void handleCancelBooking()}
                           disabled={isCancelPending}
                        >
                           {isCancelPending ? <CustomSpinner text="Cancelling..." /> : "Cancel Booking"}
                        </Button>

                        {appointment.streamStatus === 'READY' && (
                           <Link href={`/call/${streamCallId}`}>
                              <Button className="cursor-pointer bg-violet-600 hover:bg-violet-700 text-zinc-100 text-xs rounded-lg h-9 px-4.5 font-semibold shadow-lg hover:shadow-violet-600/10 flex items-center gap-1.5 max-sm:w-full">
                                 <Video className="w-3.5 h-3.5" />
                                 Join Interview
                              </Button>
                           </Link>
                        )}

                        {appointment.streamStatus === 'PENDING' && (
                           <Button
                              disabled
                              className="text-zinc-500 text-xs rounded-lg h-9 max-sm:w-full"
                           >
                              Preparing Meeting...
                           </Button>
                        )}

                        {appointment.streamStatus === 'FAILED' && (
                           <Button
                              className="cursor-pointer bg-amber-600 hover:bg-amber-700 text-zinc-100 text-xs rounded-lg h-9 px-4.5 font-semibold max-sm:w-full"
                              onClick={() => void handleRetryStreamCall()}
                              disabled={isRetryPending}
                           >
                              {isRetryPending ? <CustomSpinner text="Retrying Setup..." /> : "Retry Meeting Setup"}
                           </Button>
                        )}
                     </>
                  )}

                  {status === "COMPLETED" && recordingUrl && (
                     <a href={recordingUrl} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" className="cursor-pointer border-white/5 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 text-xs rounded-lg h-9 flex items-center gap-1.5 max-sm:w-full">
                           <Play className="w-3 h-3 text-violet-400 fill-violet-400" />
                           View Recording
                        </Button>
                     </a>
                  )}

                  {status === "COMPLETED" && feedback && (
                     <Button
                        onClick={() => {
                           if (feedback) {
                              onViewFeedback?.(feedback.id, feedback);
                           }
                        }}
                        className="cursor-pointer bg-violet-600 hover:bg-violet-700 text-zinc-100 text-xs rounded-lg h-9 px-4.5 font-semibold shadow-lg hover:shadow-violet-600/10 flex items-center gap-1.5 max-sm:w-full"
                     >
                        <FileText className="w-3.5 h-3.5 text-violet-200" />
                        View Full Feedback
                     </Button>
                  )}

                  {status === 'CANCELLED' && (
                     <Link href={`/interviewers/${appointment.interviewer.id}`}>
                        <Button className="cursor-pointer bg-violet-600/90 hover:bg-violet-600 text-zinc-100 text-xs rounded-lg h-9 px-4.5 font-semibold flex items-center gap-1.5 max-sm:w-full">
                           Book Again
                        </Button>
                     </Link>
                  )}

               </div>

            </div>
         </div>
      </CardLayout>
   );
};

export default AppointmentCard;