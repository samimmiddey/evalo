"use client";

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Clock, ArrowRight, ArrowLeftRight, Timer, Calendar } from 'lucide-react';
import { Booking } from '@/features/interviews/call/types/call.types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import CardLayout from '@/components/layouts/card-layout';
import SecondaryTitle from '@/components/common/secondary-title';
import PrimaryBody from '@/components/common/primary-body';

interface CallCountdownProps {
   booking: Booking;
   isInterviewer: boolean;
   onWindowOpen: () => void;
   onCancel: () => void;
}

const getInitials = (name: string) =>
   name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0].toUpperCase())
      .join('');

const CallCountdown = ({
   booking,
   isInterviewer,
   onWindowOpen,
   onCancel,
}: CallCountdownProps) => {
   // Room opens 10 minutes before start time
   const earlyWindowMs = new Date(booking.startTime).getTime() - 10 * 60 * 1000;

   const calculateTimeLeft = () => {
      const difference = earlyWindowMs - Date.now();
      return Math.max(0, Math.floor(difference / 1000));
   };

   const [secondsLeft, setSecondsLeft] = useState(calculateTimeLeft);

   useEffect(() => {
      const interval = setInterval(() => {
         const remaining = calculateTimeLeft();
         setSecondsLeft(remaining);

         if (remaining <= 0) {
            clearInterval(interval);
            onWindowOpen();
         }
      }, 1000);

      return () => clearInterval(interval);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [earlyWindowMs]);

   const days = Math.floor(secondsLeft / (3600 * 24));
   const hours = Math.floor((secondsLeft % (3600 * 24)) / 3600);
   const minutes = Math.floor((secondsLeft % 3600) / 60);
   const seconds = secondsLeft % 60;

   const interviewer = booking.interviewer;
   const interviewee = booking.interviewee;
   const interviewerName = `${interviewer.firstName ?? ''} ${interviewer.lastName ?? ''}`.trim() || 'Interviewer';
   const intervieweeName = `${interviewee.firstName ?? ''} ${interviewee.lastName ?? ''}`.trim() || 'Candidate';
   const scheduledStart = format(new Date(booking.startTime), 'h:mm a');
   const scheduledEnd = format(new Date(booking.endTime), 'h:mm a');
   const scheduledDate = format(new Date(booking.startTime), 'EEEE, MMMM d, yyyy');

   return (
      <div className="flex flex-col items-center justify-center min-h-dvh w-full p-4 sm:p-6 bg-zinc-950 text-zinc-100 selection:bg-violet-500/30">
         <CardLayout className="flex flex-col items-center text-center gap-4 max-w-135 w-full">
            {/* Top Icon */}
            <div className="flex items-center justify-center size-12 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 mb-1 shadow-inner">
               <Timer className="size-6" />
            </div>

            {/* Badge & Title */}
            <Badge variant="outline" className="bg-violet-500/10 text-violet-300 border-violet-500/20 text-xs p-2.5 font-normal">
               Waiting Lobby
            </Badge>

            <div className="space-y-1">
               <SecondaryTitle
                  text="Interview Not Started Yet"
                  className="text-lg! 2xl:text-xl! font-semibold! text-zinc-100!"
               />
               <PrimaryBody
                  text="The live interview room will open 10 minutes before the scheduled time."
                  className="text-xs! lg:text-xs! 2xl:text-xs! text-zinc-400! max-w-sm leading-relaxed"
               />
            </div>

            {/* Live Countdown Clock */}
            <div className="grid grid-cols-4 gap-2 sm:gap-2.5 w-full my-2">
               {[
                  { label: 'Days', value: days },
                  { label: 'Hours', value: hours },
                  { label: 'Minutes', value: minutes },
                  { label: 'Seconds', value: seconds },
               ].map(({ label, value }) => (
                  <div
                     key={label}
                     className="flex flex-col items-center justify-center py-3 px-2 rounded-xl bg-zinc-900/90 border border-white/10 shadow-inner"
                  >
                     <span className="text-xl sm:text-2xl font-bold font-mono text-zinc-100 tabular-nums">
                        {String(value).padStart(2, '0')}
                     </span>
                     <span className="text-[9px] sm:text-[10px] uppercase font-semibold text-zinc-500 tracking-wider mt-0.5">
                        {label}
                     </span>
                  </div>
               ))}
            </div>

            {/* Schedule Details Card */}
            <div className="w-full bg-zinc-900/40 border border-white/5 rounded-xl p-3.5 text-left text-xs space-y-2.5 text-zinc-300">
               <div className="flex items-center gap-2 text-zinc-400">
                  <Calendar className="size-3.5 text-violet-400 shrink-0" />
                  <span className="text-zinc-200 font-medium">{scheduledDate}</span>
               </div>
               <div className="flex items-center gap-2 text-zinc-400">
                  <Clock className="size-3.5 text-violet-400 shrink-0" />
                  <span className="text-zinc-200 font-medium">{scheduledStart} – {scheduledEnd}</span>
               </div>
            </div>

            {/* Participants Pill */}
            <div className="flex items-center justify-center gap-2 sm:gap-3 w-full py-2.5 px-3.5 rounded-xl bg-zinc-900/30 border border-white/5">
               <div className="flex items-center gap-2">
                  <Avatar className="size-6 border border-white/20">
                     <AvatarImage src={interviewee.imageUrl ?? undefined} alt={intervieweeName} />
                     <AvatarFallback className="bg-zinc-800 text-zinc-300 text-[9px]">
                        {getInitials(intervieweeName)}
                     </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-zinc-300 font-medium">{intervieweeName}</span>
               </div>

               <ArrowLeftRight className="size-3 text-zinc-600" />

               <div className="flex items-center gap-2">
                  <Avatar className="size-6 border border-violet-500/40">
                     <AvatarImage src={interviewer.imageUrl ?? undefined} alt={interviewerName} />
                     <AvatarFallback className="bg-zinc-800 text-violet-300 text-[9px]">
                        {getInitials(interviewerName)}
                     </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-zinc-300 font-medium">{interviewerName}</span>
               </div>
            </div>

            {/* Action Button */}
            <Button
               type="button"
               size="lg"
               onClick={onCancel}
               className="mt-2 w-full h-11 rounded-lg bg-violet-600 hover:bg-violet-700 text-zinc-100 border-0 font-medium transition-all gap-2 group"
            >
               <span>{isInterviewer ? 'Return to Dashboard' : 'View Your Appointments'}</span>
               <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
            </Button>
         </CardLayout>
      </div>
   );
};

export default CallCountdown;
