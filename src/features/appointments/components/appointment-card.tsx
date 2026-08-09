import { Appointment } from '@/data/appointmens/appointments.types';
import CardLayout from '@/components/layouts/card-layout';
import { Briefcase, Building2, Calendar, Clock, FileText, Hourglass, NotebookText, Play, Star, Video } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface AppointmentCardProps {
   appointment: Appointment;
}

const AppointmentCard = ({ appointment }: AppointmentCardProps) => {
   const { interviewer, status, date, timeSlot, duration, aiFeedback } = appointment;

   // Status Badge Helper
   const renderStatusBadge = (status: Appointment['status']) => {
      switch (status) {
         case 'upcoming':
            return (
               <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                  Upcoming
               </span>
            );
         case 'in-progress':
            return (
               <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/30 animate-pulse shadow-[0_0_12px_-3px_rgba(139,92,246,0.5)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-ping" />
                  In Progress
               </span>
            );
         case 'completed':
            return (
               <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Completed
               </span>
            );
         case 'cancelled':
            return (
               <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-zinc-500/10 text-red-400 border border-zinc-500/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                  Cancelled
               </span>
            );
      }
   };

   // Performance Color Helper
   const getPerformanceLevelColor = (level: string) => {
      if (level === 'Outstanding') return 'text-violet-400 border-violet-500/30 bg-violet-500/10';
      if (level === 'Excellent') return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
      return 'text-blue-400 border-blue-500/30 bg-blue-500/10';
   };

   return (
      <CardLayout className='max-sm:p-0!'>
         {/* Horizontal Card for Desktop, Stacked for Mobile */}
         <div className="flex flex-col lg:flex-row lg:items-stretch w-full">

            {/* Left Side: Interviewer Identity */}
            <div className="flex-1 p-6 2xl:p-7 flex flex-col md:flex-row md:items-start gap-5 border-b lg:border-b-0 lg:border-r border-white/5">
               <div className="relative shrink-0">
                  <div className="h-16 w-16 md:h-20 md:w-20 rounded-2xl overflow-hidden border border-white/10 group-hover:border-violet-500/25 transition-colors bg-zinc-900 shadow-xl">
                     {/* eslint-disable-next-line @next/next/no-img-element */}
                     <img
                        src={interviewer.imageUrl}
                        alt={`${interviewer.firstName} ${interviewer.lastName}`}
                        className="h-full w-full object-cover scale-100 group-hover:scale-105 transition-transform duration-500"
                     />
                  </div>

                  {/* Overall mini-rating badge */}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-zinc-950 border border-white/10 text-amber-400 shadow-md">
                     <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                     <span>{interviewer.rating}</span>
                  </div>
               </div>

               <div className="space-y-2 grow">
                  <div className="flex flex-wrap items-center justify-between gap-3">
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
                     <div className="lg:hidden">
                        {renderStatusBadge(status)}
                     </div>
                  </div>

                  <p className="text-xs text-zinc-500 font-medium">
                     {interviewer.experience} years experience
                  </p>

                  {/* Expertise Badges */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                     {interviewer.expertise.map((skill) => (
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
               <div className="p-6 2xl:p-7 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-zinc-900/10">

                  {/* Schedule info */}
                  <div className="flex justify-between md:items-center flex-wrap max-md:gap-x-5 max-md:gap-y-4 md:gap-7 text-zinc-300">
                     <div className="flex flex-col md:flex-row items-center gap-2">
                        <Calendar className="w-4 h-4 text-violet-400 shrink-0" />
                        <div className="text-center md:text-left">
                           <span className="block text-[10px] uppercase text-zinc-500 font-semibold tracking-wider md:hidden">Date</span>
                           <span className="text-xs 2xl:text-sm font-semibold text-zinc-200">{date}</span>
                        </div>
                     </div>

                     <div className="flex flex-col md:flex-row items-center gap-2">
                        <Clock className="w-4 h-4 text-violet-400 shrink-0" />
                        <div className="text-center md:text-left">
                           <span className="block text-[10px] uppercase text-zinc-500 font-semibold tracking-wider md:hidden">Time</span>
                           <span className="text-xs 2xl:text-sm font-medium text-zinc-300">{timeSlot}</span>
                        </div>
                     </div>

                     <div className="flex flex-col md:flex-row items-center gap-2">
                        <Hourglass className="w-4 h-4 text-violet-400 shrink-0" />
                        <div className="text-center md:text-left">
                           <span className="block text-[10px] uppercase text-zinc-500 font-semibold tracking-wider md:hidden">Duration</span>
                           <span className="text-xs 2xl:text-sm font-semibold text-zinc-300">{duration}</span>
                        </div>
                     </div>
                  </div>

                  {/* Status Badge (desktop) */}
                  <div className="hidden lg:block">
                     {renderStatusBadge(status)}
                  </div>
               </div>

               {/* Bottom Row: AI Feedback summary (Only for COMPLETED) */}
               {status === 'completed' && aiFeedback && (
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
                              <p className="text-sm text-zinc-300 leading-relaxed mt-2 font-medium">
                                 {aiFeedback.summary}
                              </p>
                           </div>

                           {/* Performance and Overall Score indicators */}
                           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3.5 border-t border-white/5">
                              <div className="flex flex-wrap justify-between items-center gap-4 w-full">
                                 <div className="flex items-center gap-2">
                                    <span className="text-xs text-zinc-500">Performance:</span>
                                    <span className={`text-xs px-2.5 py-0.5 rounded-full border font-bold ${getPerformanceLevelColor(aiFeedback.performanceLevel)}`}>
                                       {aiFeedback.performanceLevel}
                                    </span>
                                 </div>

                                 <div className="flex items-center gap-2.5">
                                    <span className="text-xs text-zinc-500">Overall Score:</span>
                                    <div className="flex items-center gap-2">
                                       <div className="h-2 w-20 bg-zinc-800 rounded-full overflow-hidden">
                                          <div
                                             className="h-full bg-linear-to-r from-violet-500 to-indigo-500 rounded-full"
                                             style={{ width: `${aiFeedback.overallScore}%` }}
                                          />
                                       </div>
                                       <span className="text-xs font-bold text-zinc-200 font-outfit">{aiFeedback.overallScore}/100</span>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               )}

               {/* Actions Area */}
               <div className="p-6 2xl:p-7 flex flex-wrap items-center justify-end gap-2.5 2xl:gap-3">

                  {status === 'upcoming' && (
                     <>
                        <Button variant="ghost" className="cursor-pointer text-zinc-400 hover:text-rose-400 hover:bg-rose-500/5 text-xs rounded-lg h-9">
                           Cancel Booking
                        </Button>
                        <Button className="cursor-pointer bg-violet-600 hover:bg-violet-700 text-zinc-100 text-xs rounded-lg h-9 px-4.5 font-semibold shadow-lg hover:shadow-violet-600/10 flex items-center gap-1.5">
                           <Video className="w-3.5 h-3.5" />
                           Join Interview
                        </Button>
                     </>
                  )}

                  {status === 'in-progress' && (
                     <>
                        <Button variant="outline" className="cursor-pointer border-white/5 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 text-xs rounded-lg h-9">
                           View Room Info
                        </Button>
                        <Button className="cursor-pointer bg-violet-600 hover:bg-violet-700 text-zinc-100 text-xs rounded-lg h-9 px-4.5 font-semibold shadow-lg animate-pulse flex items-center gap-1.5">
                           <Video className="w-3.5 h-3.5" />
                           Enter Session
                        </Button>
                     </>
                  )}

                  {status === 'completed' && (
                     <>
                        <Button variant="outline" className="cursor-pointer border-white/5 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 text-xs rounded-lg h-9 flex items-center gap-1.5">
                           <Play className="w-3 h-3 text-violet-400 fill-violet-400" />
                           View Recording
                        </Button>
                        <Button className="cursor-pointer bg-violet-600 hover:bg-violet-700 text-zinc-100 text-xs rounded-lg h-9 px-4.5 font-semibold shadow-lg hover:shadow-violet-600/10 flex items-center gap-1.5">
                           <FileText className="w-3.5 h-3.5 text-violet-200" />
                           View Full Feedback
                        </Button>
                     </>
                  )}

                  {status === 'cancelled' && (
                     <>
                        <Button className="cursor-pointer bg-violet-600/90 hover:bg-violet-600 text-zinc-100 text-xs rounded-lg h-9 px-4.5 font-semibold flex items-center gap-1.5">
                           Book Again
                        </Button>
                     </>
                  )}

               </div>

            </div>
         </div>
      </CardLayout>
   );
};

export default AppointmentCard;