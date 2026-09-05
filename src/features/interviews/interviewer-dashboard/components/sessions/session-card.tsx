import CardLayout from "@/components/layouts/card-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import SecondaryTitle from "@/components/common/secondary-title";
import PrimaryBody from "@/components/common/primary-body";
import { DashboardSession, SessionFeedback } from "../../../shared/types/shared.types";
import { differenceInMinutes, format } from "date-fns";
import {
   Calendar,
   Clock,
   Coins,
   FileText,
   Hourglass,
   Info,
   Mail,
   NotebookText,
   Play,
   User,
   Video
} from "lucide-react";
import Link from "next/link";
import { ViewType } from "@/types/ui.types";

interface SessionCardProps {
   session: DashboardSession;
   view?: ViewType;
   onViewFeedback: (feedback: SessionFeedback, candidateName: string) => void;
}

export const SessionCard = ({
   session,
   view = "list",
   onViewFeedback
}: SessionCardProps) => {
   const {
      startTime,
      endTime,
      status,
      streamStatus,
      creditsCharged,
      streamCallId,
      recordingUrl,
      candidate,
      feedback
   } = session;

   const startDate = new Date(startTime);
   const endDate = new Date(endTime);
   const now = new Date();

   const isExpired = status === "SCHEDULED" && now > endDate;
   const canJoinCall =
      status === "SCHEDULED" &&
      streamCallId &&
      streamStatus === "READY" &&
      !isExpired;

   const candidateFullName =
      candidate.firstName || candidate.lastName
         ? `${candidate.firstName ?? ""} ${candidate.lastName ?? ""}`.trim()
         : candidate.email;

   const initials =
      candidate.firstName && candidate.lastName
         ? `${candidate.firstName[0]}${candidate.lastName[0]}`.toUpperCase()
         : "U";

   const durationMins = differenceInMinutes(endDate, startDate);

   // Status Badge Helper matching appointment-card
   const renderStatusBadge = (sessionStatus: DashboardSession["status"]) => {
      if (sessionStatus === "SCHEDULED" && isExpired) {
         return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-zinc-500/10 text-zinc-400 border border-white/10">
               <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
               Expired
            </span>
         );
      }

      switch (sessionStatus) {
         case "SCHEDULED":
            return (
               <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                  Scheduled
               </span>
            );
         case "COMPLETED":
            return (
               <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Completed
               </span>
            );
         case "CANCELLED":
            return (
               <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-zinc-500/10 text-rose-400 border border-white/10">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
                  Cancelled
               </span>
            );
         default:
            return null;
      }
   };

   // Performance Level Color Helper matching appointment-card
   const getPerformanceLevelColor = (level: string) => {
      const upper = level?.toUpperCase() || "";
      if (upper === "OUTSTANDING" || upper === "EXCELLENT") {
         return "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";
      }
      if (upper === "GOOD") {
         return "text-blue-400 border-blue-500/30 bg-blue-500/10";
      }
      if (upper === "AVERAGE") {
         return "text-amber-400 border-amber-500/30 bg-amber-500/10";
      }
      if (upper === "POOR") {
         return "text-rose-400 border-rose-500/30 bg-rose-500/10";
      }
      return "text-zinc-400 border-white/10 bg-zinc-500/10";
   };

   // Refined Credits Charged Badge
   const getCreditsChargedBadge = () => {
      if (status === "COMPLETED") {
         return (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
               <Coins className="w-3.5 h-3.5" />
               <span>{`+${creditsCharged} Credit${creditsCharged > 1 ? "s" : ""} Earned`}</span>
            </div>
         );
      }

      if (status === "SCHEDULED") {
         if (isExpired) {
            return (
               <div className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-zinc-500/10 text-zinc-400 border border-zinc-500/20">
                  <Coins className="w-3.5 h-3.5" />
                  <span>0 Credits (Expired)</span>
               </div>
            );
         }

         return (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-violet-500/10 text-violet-400 border border-violet-500/20">
               <Coins className="w-3.5 h-3.5" />
               <span>{`${creditsCharged} Credit${creditsCharged > 1 ? "s" : ""} (Pending)`}</span>
            </div>
         );
      }

      return (
         <div className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <Coins className="w-3.5 h-3.5" />
            <span>0 Credits (Refunded)</span>
         </div>
      );
   };

   return (
      <CardLayout className="max-sm:p-0!">
         {/* Responsive layout: Stacked in Grid view or mobile, Horizontal in List view on desktop */}
         <div
            className={`flex w-full ${view === "grid" ? "flex-col" : "flex-col lg:flex-row lg:items-stretch"
               }`}
         >
            {/* Left Side: Candidate Identity */}
            <div
               className={`flex-1 p-6 2xl:p-7 flex flex-col md:flex-row md:items-start gap-5 border-white/5 ${view === "grid" ? "border-b" : "lg:border-r border-b lg:border-b-0"
                  }`}
            >
               <div className="w-16 md:w-20 relative shrink-0">
                  <Avatar className="h-16 w-16 md:h-20 md:w-20 rounded-2xl border border-white/10 bg-zinc-900 shadow-xl after:rounded-2xl after:border-none">
                     <AvatarImage
                        src={candidate.imageUrl ?? ""}
                        alt={candidateFullName}
                        className="rounded-2xl"
                     />
                     <AvatarFallback className="bg-violet-950 text-violet-300 font-bold text-base md:text-lg rounded-2xl">
                        {initials}
                     </AvatarFallback>
                  </Avatar>
               </div>

               <div className="space-y-2 grow">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                     <div>
                        <SecondaryTitle
                           text={candidateFullName}
                           className="text-lg! font-bold! text-zinc-100! group-hover:text-violet-400 transition-colors font-outfit"
                        />

                        <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-zinc-400">
                           <span className="flex items-center gap-1.5 text-sm text-zinc-400">
                              <Mail className="w-3.5 h-3.5 text-violet-400/80" />
                              {candidate.email}
                           </span>
                        </div>
                     </div>

                     {/* Status Badge (visible on mobile next to title) */}
                     <div className="md:hidden">{renderStatusBadge(status)}</div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                     <Badge
                        variant="outline"
                        className="bg-zinc-900 border-white/10 text-zinc-400 shrink-0 p-3 cursor-pointer transition-colors font-medium"
                     >
                        <User className="w-3 h-3 mr-1 text-violet-400" />
                        Candidate
                     </Badge>
                  </div>
               </div>
            </div>

            {/* Right Side: Schedule, Details & Actions */}
            <div className="flex-[1.25] flex flex-col justify-between">
               {/* Top Row of Right: Schedule info & Desktop Status Badge */}
               <div className="p-6 2xl:p-7 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between flex-wrap gap-4 bg-zinc-900/10">
                  {/* Schedule info */}
                  <div className="flex justify-between md:items-center flex-wrap max-md:gap-x-5 max-md:gap-y-4 md:gap-7 text-zinc-300">
                     <div className="flex flex-col md:flex-row items-center gap-2">
                        <Calendar className="w-4 h-4 text-violet-400 shrink-0" />
                        <div className="text-center md:text-left">
                           <span className="block text-[10px] uppercase text-zinc-500 font-semibold tracking-wider md:hidden">
                              Date
                           </span>
                           <span className="text-xs 2xl:text-sm font-semibold text-zinc-200">
                              {format(startDate, "MMM d, yyyy")}
                           </span>
                        </div>
                     </div>

                     <div className="flex flex-col md:flex-row items-center gap-2">
                        <Clock className="w-4 h-4 text-violet-400 shrink-0" />
                        <div className="text-center md:text-left">
                           <span className="block text-[10px] uppercase text-zinc-500 font-semibold tracking-wider md:hidden">
                              Time
                           </span>
                           <span className="text-xs 2xl:text-sm font-medium text-zinc-300">
                              {format(startDate, "h:mm a")} - {format(endDate, "h:mm a")}
                           </span>
                        </div>
                     </div>

                     <div className="flex flex-col md:flex-row items-center gap-2">
                        <Hourglass className="w-4 h-4 text-violet-400 shrink-0" />
                        <div className="text-center md:text-left">
                           <span className="block text-[10px] uppercase text-zinc-500 font-semibold tracking-wider md:hidden">
                              Duration
                           </span>
                           <span className="text-xs 2xl:text-sm font-semibold text-zinc-300">
                              {durationMins} mins
                           </span>
                        </div>
                     </div>
                  </div>

                  {/* Status Badge (desktop) */}
                  <div className="hidden md:block">{renderStatusBadge(status)}</div>
               </div>

               {/* Middle Row: Guideline if SCHEDULED / Feedback summary if COMPLETED */}
               {status === "SCHEDULED" && !isExpired && (
                  <div className="p-6 2xl:p-7 border-b border-white/5">
                     <div className="flex max-sm:flex-col items-start gap-3.5">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-400 shadow-sm shrink-0 max-sm:mb-1">
                           <Info className="w-4 h-4" />
                        </div>
                        <div>
                           <span className="text-xs font-bold text-violet-300 uppercase tracking-widest">
                              Mock Interview Session
                           </span>
                           <PrimaryBody
                              text="Be ready at the scheduled time. Ensure your camera and microphone are tested before entering the live call room."
                              className="text-sm! lg:text-sm! 2xl:text-sm! text-zinc-300! leading-relaxed mt-1"
                           />
                        </div>
                     </div>
                  </div>
               )}

               {status === "COMPLETED" && feedback && (
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
                              <PrimaryBody
                                 text={feedback.summary}
                                 className="text-sm! lg:text-sm! 2xl:text-sm! text-zinc-300! leading-relaxed mt-1"
                              />
                           </div>

                           {/* Performance and Overall Score indicators */}
                           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3.5 border-t border-white/5">
                              <div className="flex flex-wrap justify-between items-center gap-4 w-full">
                                 <div className="flex items-center gap-2">
                                    <span className="text-xs text-zinc-500">Performance:</span>
                                    <span
                                       className={`text-xs px-2.5 py-0.5 rounded-full border font-bold ${getPerformanceLevelColor(
                                          feedback.overallRating
                                       )}`}
                                    >
                                       {feedback.overallRating}
                                    </span>
                                 </div>

                                 {feedback.sessionRating && (
                                    <div className="flex items-center gap-2.5">
                                       <span className="text-xs text-zinc-500">Score:</span>
                                       <div className="flex items-center gap-2">
                                          <div className="h-2 w-20 bg-zinc-800 rounded-full overflow-hidden">
                                             <div
                                                className="h-full bg-linear-to-r from-violet-500 to-indigo-500 rounded-full"
                                                style={{
                                                   width: `${(feedback.sessionRating / 5) * 100}%`
                                                }}
                                             />
                                          </div>
                                          <span className="text-xs font-bold text-zinc-200 font-outfit">
                                             {(feedback.sessionRating / 5) * 100}/100
                                          </span>
                                       </div>
                                    </div>
                                 )}
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               )}

               {/* Notice if COMPLETED without feedback */}
               {status === "COMPLETED" && !feedback && (
                  <div className="p-6 2xl:p-7 border-b border-white/5">
                     <div className="flex items-center gap-3 text-zinc-400 text-xs">
                        <Info className="w-4 h-4 text-zinc-500 shrink-0" />
                        <span>AI performance evaluation is unavailable for this session.</span>
                     </div>
                  </div>
               )}

               {/* Bottom Actions Area */}
               <div className="p-6 2xl:p-7 flex max-sm:flex-col sm:flex-wrap sm:items-center sm:justify-between gap-5 2xl:gap-6">
                  {/* Left: Credits Tag */}
                  <div className="max-sm:w-full flex max-sm:justify-start">
                     {getCreditsChargedBadge()}
                  </div>

                  {/* Right: Action Buttons */}
                  <div className="flex max-sm:flex-col sm:flex-wrap sm:items-center sm:justify-end gap-2.5 2xl:gap-3 max-sm:w-full">
                     {/* Join call button for scheduled */}
                     {canJoinCall && (
                        <Link href={`/call/${streamCallId}`} className="max-sm:w-full">
                           <Button className="cursor-pointer bg-violet-600 hover:bg-violet-700 text-zinc-100 text-xs rounded-lg h-9 px-4.5 font-semibold shadow-lg hover:shadow-violet-600/10 flex items-center gap-1.5 max-sm:w-full">
                              <Video className="w-3.5 h-3.5" />
                              Join Interview
                           </Button>
                        </Link>
                     )}

                     {/* Preparing state */}
                     {status === "SCHEDULED" && streamStatus === "PENDING" && !isExpired && (
                        <Button
                           disabled
                           className="text-zinc-500 text-xs rounded-lg h-9 max-sm:w-full"
                        >
                           Preparing Meeting...
                        </Button>
                     )}

                     {/* Recording URL if present */}
                     {status === "COMPLETED" && recordingUrl && (
                        <a
                           href={recordingUrl}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="max-sm:w-full"
                        >
                           <Button
                              variant="outline"
                              className="cursor-pointer border-white/5 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 text-xs rounded-lg h-9 flex items-center gap-1.5 max-sm:w-full"
                           >
                              <Play className="w-3 h-3 text-violet-400 fill-violet-400" />
                              View Recording
                           </Button>
                        </a>
                     )}

                     {/* View feedback for completed */}
                     {status === "COMPLETED" && feedback && (
                        <Button
                           onClick={() => onViewFeedback(feedback, candidateFullName)}
                           className="cursor-pointer bg-violet-600 hover:bg-violet-700 text-zinc-100 text-xs rounded-lg h-9 px-4.5 font-semibold shadow-lg hover:shadow-violet-600/10 flex items-center gap-1.5 max-sm:w-full"
                        >
                           <FileText className="w-3.5 h-3.5 text-violet-200" />
                           View Full Feedback
                        </Button>
                     )}
                  </div>
               </div>
            </div>
         </div>
      </CardLayout>
   );
};

export default SessionCard;
