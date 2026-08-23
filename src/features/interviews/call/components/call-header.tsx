'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Clock, Video, ArrowLeftRight } from 'lucide-react';
import { Booking } from '@/features/interviews/call/types/call.types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface CallHeaderProps {
   booking: Booking;
}

const formatDuration = (totalSeconds: number): string => {
   const h = Math.floor(totalSeconds / 3600);
   const m = Math.floor((totalSeconds % 3600) / 60);
   const s = totalSeconds % 60;
   const pad = (n: number) => String(n).padStart(2, '0');
   return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
};

const getInitials = (name: string) =>
   name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0].toUpperCase())
      .join('');

const CallHeader = ({ booking }: CallHeaderProps) => {
   const [elapsedSeconds, setElapsedSeconds] = useState(0);

   useEffect(() => {
      const id = setInterval(() => setElapsedSeconds((s) => s + 1), 1000);
      return () => clearInterval(id);
   }, []);

   const interviewer = booking.interviewer;
   const interviewee = booking.interviewee;
   const interviewerName = `${interviewer.firstName ?? ''} ${interviewer.lastName ?? ''}`.trim() || 'Interviewer';
   const intervieweeName = `${interviewee.firstName ?? ''} ${interviewee.lastName ?? ''}`.trim() || 'Candidate';
   const scheduledStart = format(new Date(booking.startTime), 'h:mm a');
   const scheduledEnd = format(new Date(booking.endTime), 'h:mm a');

   return (
      <header className="flex items-center justify-between gap-3 px-4 lg:px-6 py-3 bg-zinc-900/60 border-b border-white/10 backdrop-blur-md shrink-0 z-30">
         {/* Left: Branding + Topic & Status */}
         <div className="flex items-center gap-3 min-w-0">
            <div className="flex items-center justify-center size-9 rounded-lg bg-violet-600/10 border border-violet-500/30 text-violet-400 shrink-0">
               <Video className="size-5" />
            </div>

            <div className="min-w-0">
               <div className="flex items-center gap-2">
                  <h1 className="text-sm font-semibold text-zinc-100 truncate">
                     Technical Mock Interview
                  </h1>
                  <Badge variant="outline" className="hidden sm:inline-flex items-center gap-1.5 bg-red-500/10 text-red-300 border-red-500/20 text-[10px] font-medium px-2 py-0.5">
                     <span className="relative flex size-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                        <span className="relative inline-flex rounded-full size-1.5 bg-red-500" />
                     </span>
                     Live
                  </Badge>
               </div>
               <p className="text-xs mt-0.5 text-zinc-400 truncate max-w-xs sm:max-w-md">
                  <span className="text-zinc-500">{scheduledStart} - {scheduledEnd}</span>
               </p>
            </div>
         </div>

         {/* Centre: Participants Pill */}
         <div className="hidden md:flex items-center gap-3 px-3.5 py-1.5 rounded-xl bg-zinc-950/60 border border-white/5 shadow-inner">
            <div className="flex items-center gap-2">
               <Avatar className="border border-white/20 size-7 shrink-0">
                  <AvatarImage src={interviewee.imageUrl ?? undefined} alt={intervieweeName} />
                  <AvatarFallback className="bg-zinc-800 text-zinc-300 text-[10px] font-medium">
                     {getInitials(intervieweeName)}
                  </AvatarFallback>
               </Avatar>
               <div className="text-left">
                  <p className="text-xs font-medium text-zinc-200 leading-none">{intervieweeName}</p>
                  <p className="text-[10px] text-zinc-500 mt-0.5">Candidate</p>
               </div>
            </div>

            <ArrowLeftRight className="size-3 text-zinc-600" />

            <div className="flex items-center gap-2">
               <Avatar className="border border-violet-500/40 size-7 shrink-0">
                  <AvatarImage src={interviewer.imageUrl ?? undefined} alt={interviewerName} />
                  <AvatarFallback className="bg-zinc-800 text-violet-300 text-[10px] font-medium">
                     {getInitials(interviewerName)}
                  </AvatarFallback>
               </Avatar>
               <div className="text-left">
                  <p className="text-xs font-medium text-zinc-200 leading-none">{interviewerName}</p>
                  <p className="text-[10px] text-violet-400 mt-0.5">Interviewer</p>
               </div>
            </div>
         </div>

         {/* Right: Elapsed Duration + Leave/End Action */}
         <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Badge
               variant="outline"
               className="gap-1.5 font-mono tabular-nums border-white/10 bg-zinc-800/60 text-zinc-200 px-3 py-1.5 text-xs shadow-sm"
            >
               <Clock className="size-3.5 text-violet-400" />
               {formatDuration(elapsedSeconds)}
            </Badge>
         </div>
      </header>
   );
};

export default CallHeader;

