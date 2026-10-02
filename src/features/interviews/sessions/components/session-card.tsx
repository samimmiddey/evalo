import CardLayout from "@/components/layouts/card-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import SecondaryTitle from "@/components/common/secondary-title";
import PrimaryBody from "@/components/common/primary-body";
import { DashboardSession, SessionFeedback } from "../../shared/types/shared.types";
import { differenceInMinutes, format } from "date-fns";
import {
   Calendar,
   CalendarX,
   Clock,
   Coins,
   FileText,
   Hourglass,
   Info,
   Mail,
   NotebookText,
   Play,
   RotateCcw,
   Star,
   User,
   Video
} from "lucide-react";
import Link from "next/link";
import { ViewType } from "@/types/ui.types";
import { useState, useEffect } from "react";
import { useMutation } from "@/hooks/use-mutation";
import { useAppUser } from "@/hooks/use-app-user";
import { cancelBooking } from "@/features/interviews/appointments/services/appointments.client.service";
import ConfirmDialog from "@/components/common/confirm-dialog";
import { toast } from "sonner";
import { sessionsData } from "@/data/sessions/sessions.data";

interface SessionCardProps {
   session: DashboardSession;
   view?: ViewType;
   onViewFeedback: (feedback: SessionFeedback, candidateName: string) => void;
   refetchSessions?: () => void;
}

export const SessionCard = ({
   session,
   view = "list",
   onViewFeedback,
   refetchSessions
}: SessionCardProps) => {
   const [openDialogue, setOpenDialogue] = useState<boolean>(false);
   const { refetch: refetchUser } = useAppUser();

   const {
      isPending: isCancelPending,
      error: cancelError,
      mutate: cancelMutation
   } = useMutation(() => cancelBooking(session.id));

   const handleCancelSession = async () => {
      const res = await cancelMutation();

      if (res?.success) {
         toast.success("Session cancelled successfully. Candidate has been refunded.");
         setOpenDialogue(false);
         refetchSessions?.();
         await refetchUser();
      }
   };

   useEffect(() => {
      if (cancelError) {
         toast.error(cancelError);
      }
   }, [cancelError]);
   const {
      startTime,
      endTime,
      status,
      completionReason,
      streamStatus,
      creditsCharged,
      streamCallId,
      recordingUrl,
      candidate,
      feedback,
      review
   } = session;

   const startDate = new Date(startTime);
   const endDate = new Date(endTime);
   const [nowMs] = useState<number>(() => Date.now());
   const endMs = endDate.getTime();
   const GRACE_PERIOD_MS = 15 * 60 * 1000;

   const isPastEndTime = nowMs > endMs;
   const isWithinGracePeriod = status === "SCHEDULED" && isPastEndTime && nowMs <= (endMs + GRACE_PERIOD_MS);
   const isExpired = status === "EXPIRED" || (status === "SCHEDULED" && nowMs > (endMs + GRACE_PERIOD_MS));

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
      if (sessionStatus === "COMPLETED" && completionReason === "CANDIDATE_NO_SHOW") {
         return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
               <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
               Compensated (No-Show)
            </span>
         );
      }

      if (isWithinGracePeriod) {
         return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
               <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
               Under Review
            </span>
         );
      }

      if (sessionStatus === "EXPIRED" || (sessionStatus === "SCHEDULED" && isExpired)) {
         return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-zinc-500/15 text-zinc-400 border border-white/10">
               <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
               Expired
            </span>
         );
      }

      switch (sessionStatus) {
         case "SCHEDULED":
            return (
               <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                  Scheduled
               </span>
            );
         case "COMPLETED":
            return (
               <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Completed
               </span>
            );
         case "CANCELLED":
            return (
               <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-zinc-500/15 text-rose-400 border border-white/10">
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
         return "text-emerald-400 border-emerald-500/30 bg-emerald-500/15";
      }
      if (upper === "GOOD") {
         return "text-blue-400 border-blue-500/30 bg-blue-500/15";
      }
      if (upper === "AVERAGE") {
         return "text-amber-400 border-amber-500/30 bg-amber-500/15";
      }
      if (upper === "POOR") {
         return "text-rose-400 border-rose-500/30 bg-rose-500/15";
      }
      return "text-zinc-400 border-white/10 bg-zinc-500/15";
   };

   const getOverallScore = (rating: string) => {
      switch (rating?.toUpperCase()) {
         case 'EXCELLENT':
            return 100;
         case 'GOOD':
            return 75;
         case 'AVERAGE':
            return 50;
         case 'POOR':
            return 25;
         default:
            return 0;
      }
   };

   // Refined Credits Charged Badge
   const getCreditsChargedBadge = () => {
      if (status === "COMPLETED") {
         const suffix = completionReason === "CANDIDATE_NO_SHOW" ? "Earned (No-Show)" : "Earned";
         return (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
               <Coins className="w-3.5 h-3.5" />
               <span>{`+${creditsCharged} Credit ${suffix}`}</span>
            </div>
         );
      }

      if (status === "EXPIRED" || (status === "SCHEDULED" && isExpired)) {
         return (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-zinc-500/15 text-zinc-400 border border-zinc-500/30">
               <Coins className="w-3.5 h-3.5" />
               <span>0 Credit (Expired)</span>
            </div>
         );
      }

      if (status === "SCHEDULED") {
         return (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-violet-500/15 text-violet-400 border border-violet-500/30">
               <Coins className="w-3.5 h-3.5" />
               <span>{`${creditsCharged} Credit (Pending)`}</span>
            </div>
         );
      }

      return (
         <div className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-rose-500/15 text-rose-400 border border-rose-500/30">
            <Coins className="w-3.5 h-3.5" />
            <span>0 Credit (Cancelled)</span>
         </div>
      );
   };

   return (
      <>
         <CardLayout className="max-sm:p-0!">
            {/* Responsive layout: Stacked in Grid view or mobile, Horizontal in List view on desktop */}
            <div
               className={`flex w-full ${view === "grid" ? "flex-col" : "flex-col lg:flex-row lg:items-stretch"
                  }`}
            >
               {/* Left Side: Candidate Identity */}
               <div
                  className={`flex-1 flex flex-col justify-between gap-2 lg:gap-6 2xl:gap-7 border-white/5 ${view === "grid" ? "border-b" : "lg:border-r border-b lg:border-b-0"
                     }`}
               >
                  <div className="flex flex-col md:flex-row md:items-start gap-5 p-6 2xl:p-7">
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
                                 className="text-lg! group-hover:text-violet-400 transition-colors font-geist"
                              />

                              <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-zinc-400">
                                 <span className="flex items-center gap-1.5 text-xs 2xl:text-[13px] text-zinc-400">
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

                  {/* Candidate Rating & Review on Left Bottom for COMPLETED Sessions */}
                  {status === "COMPLETED" && completionReason !== "CANDIDATE_NO_SHOW" && review?.rating && (
                     <div className="p-6 2xl:p-7 border-t border-white/5">
                        <div className="space-y-1">
                           <div className="flex items-center gap-2">
                              <div className="flex items-center gap-0.5">
                                 {[1, 2, 3, 4, 5].map((s) => (
                                    <Star
                                       key={s}
                                       className={`w-3.5 h-3.5 ${s <= (review.rating ?? 0)
                                          ? "text-amber-400 fill-amber-400"
                                          : "text-zinc-700"
                                          }`}
                                    />
                                 ))}
                              </div>
                              <span className="text-sm font-semibold text-zinc-200">
                                 {review.rating}.0
                              </span>
                           </div>
                           {review.comment && (
                              <PrimaryBody
                                 text={review.comment}
                                 className="text-xs! italic line-clamp-2 mt-2"
                              />
                           )}
                        </div>
                     </div>
                  )}
               </div>

               {/* Right Side: Schedule, Details & Actions */}
               <div className="flex-[1.25] flex flex-col justify-between">
                  {/* Top Row of Right: Schedule info & Desktop Status Badge */}
                  <div className="p-6 2xl:p-7 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between flex-wrap gap-4">
                     {/* Schedule info */}
                     <div className="flex justify-between md:items-center flex-wrap max-md:gap-x-5 max-md:gap-y-4 md:gap-7 text-zinc-300">
                        <div className="flex flex-col md:flex-row items-center gap-2">
                           <Calendar className="w-4 h-4 text-violet-400 shrink-0" />
                           <div className="text-center md:text-left">
                              <span className="block text-[10px] uppercase text-zinc-500 font-semibold tracking-wider md:hidden">
                                 Date
                              </span>
                              <span className="text-xs 2xl:text-sm font-medium text-zinc-200">
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
                              <span className="text-xs 2xl:text-sm font-medium text-zinc-300">
                                 {durationMins} mins
                              </span>
                           </div>
                        </div>
                     </div>

                     {/* Status Badge (desktop) */}
                     <div className="hidden md:block">{renderStatusBadge(status)}</div>
                  </div>

                  {/* Guidelines */}
                  {(status === "SCHEDULED" || status === "COMPLETED") && !feedback && !isPastEndTime && (
                     <div className="p-6 2xl:p-7 border-b border-white/5">
                        <div className="flex max-sm:flex-col items-start gap-3.5">
                           <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/15 border border-blue-500/30 text-blue-400 shadow-sm shrink-0 max-sm:mb-1">
                              <Info className="w-4 h-4" />
                           </div>
                           <div>
                              <span className="text-xs font-semibold text-blue-300 uppercase tracking-widest">
                                 {sessionsData.helpfulTips.header}
                              </span>
                              <ul className="flex flex-col list-disc pl-4!">
                                 {sessionsData.helpfulTips.body.map((item) => (
                                    <li key={item} className="text-[13px] text-blue-200/90 leading-[1.4] mt-2">
                                       {item}
                                    </li>
                                 ))}
                              </ul>
                           </div>
                        </div>
                     </div>
                  )}

                  {/* Session Under Review (Grace Period) */}
                  {isWithinGracePeriod && (
                     <div className="p-6 2xl:p-7 border-b border-white/5">
                        <div className="flex max-sm:flex-col items-start gap-3.5">
                           <div className="flex items-center justify-center size-8 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400 shrink-0 max-sm:mb-1 shadow-sm">
                              <Hourglass className="size-4" />
                           </div>
                           <div>
                              <span className="text-xs font-semibold text-amber-200 uppercase tracking-widest">
                                 Session Under Review
                              </span>
                              <PrimaryBody
                                 text="The interview time slot has concluded. Session attendance is being verified and interviewer compensation is processing. Please allow a few moments."
                                 className="text-[13px]! mt-2 text-amber-100/90"
                              />
                           </div>
                        </div>
                     </div>
                  )}

                  {/* Session Cancelled */}
                  {status === "CANCELLED" && (
                     <div className="p-6 2xl:p-7 border-b border-white/5">
                        <div className="flex max-sm:flex-col items-start gap-3.5">
                           <div className="flex items-center justify-center size-8 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-400 shrink-0 max-sm:mb-1 shadow-sm">
                              <CalendarX className="size-4" />
                           </div>
                           <div>
                              <span className="text-xs font-semibold text-rose-300 uppercase tracking-widest">
                                 Session Cancelled & Refunded
                              </span>
                              <PrimaryBody
                                 text="This interview session has been cancelled, and the full credit amount has been returned to the candidate's account balance."
                                 className="text-[13px]! mt-2 text-rose-200/90"
                              />
                           </div>
                        </div>
                     </div>
                  )}

                  {/* Session Expired Banner */}
                  {isExpired && (
                     <div className="p-6 2xl:p-7 border-b border-white/5">
                        <div className="flex max-sm:flex-col items-start gap-3.5">
                           <div className="flex items-center justify-center size-8 rounded-lg bg-white/5 border border-white/10 text-zinc-300 shrink-0 max-sm:mb-1 shadow-sm">
                              <RotateCcw className="size-4" />
                           </div>
                           <div>
                              <span className="text-xs font-semibold text-zinc-300 uppercase tracking-widest">
                                 Session Expired
                              </span>
                              <PrimaryBody
                                 text="This interview session has expired and was not conducted. No credits were earned for this session."
                                 className="text-[13px]! mt-2 text-zinc-400"
                              />
                           </div>
                        </div>
                     </div>
                  )}

                  {/* Session Completed and AI Feedback Summary */}
                  {status === "COMPLETED" && feedback && (
                     <div className="p-6 2xl:p-7 border-b border-white/5">
                        <div className="flex max-sm:flex-col items-start gap-3.5">
                           <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-violet-500/15 border border-violet-500/30 text-violet-400 shadow-sm shrink-0 max-sm:mb-1">
                              <NotebookText className="w-4 h-4" />
                           </div>

                           <div className="space-y-3.5 w-full">
                              <div>
                                 <span className="text-xs font-semibold text-violet-300 uppercase tracking-widest">
                                    AI Feedback Evaluation
                                 </span>
                                 <PrimaryBody
                                    text={feedback.summary}
                                    className="text-[13px]! text-zinc-300! leading-relaxed mt-1"
                                 />
                              </div>

                              {/* Performance and Overall Score indicators */}
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3.5 border-t border-white/5">
                                 <div className="flex flex-wrap justify-between items-center gap-4 w-full">
                                    <div className="flex items-center gap-2">
                                       <span className="text-xs text-zinc-500">Performance:</span>
                                       <span
                                          className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold ${getPerformanceLevelColor(
                                             feedback.overallRating
                                          )}`}
                                       >
                                          {feedback.overallRating}
                                       </span>
                                    </div>

                                    <div className="flex items-center gap-2.5">
                                       <span className="text-xs text-zinc-500">Overall Score:</span>
                                       <div className="flex items-center gap-2">
                                          <div className="h-2 w-20 bg-zinc-800 rounded-full overflow-hidden">
                                             <div
                                                className="h-full bg-linear-to-r from-violet-500 to-indigo-500 rounded-full"
                                                style={{
                                                   width: `${getOverallScore(feedback.overallRating)}%`
                                                }}
                                             />
                                          </div>
                                          <span className="text-xs font-semibold text-zinc-200">
                                             {getOverallScore(feedback.overallRating)}/100
                                          </span>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  )}

                  {/* Candidate No-Show Host Compensated Notice */}
                  {status === "COMPLETED" && completionReason === "CANDIDATE_NO_SHOW" && (
                     <div className="p-6 2xl:p-7 border-b border-white/5">
                        <div className="flex max-sm:flex-col items-start gap-3.5">
                           <div className="flex items-center justify-center size-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shrink-0 max-sm:mb-1 shadow-sm">
                              <Coins className="size-4" />
                           </div>
                           <div>
                              <span className="text-xs font-semibold text-emerald-300 uppercase tracking-widest">
                                 Candidate No-Show (Compensated)
                              </span>
                              <PrimaryBody
                                 text="The candidate did not attend the scheduled interview session. You have been fully compensated for reserving your time slot."
                                 className="text-[13px]! mt-2 text-emerald-200/90"
                              />
                           </div>
                        </div>
                     </div>
                  )}

                  {/* Notice if COMPLETED without feedback */}
                  {status === "COMPLETED" && completionReason !== "CANDIDATE_NO_SHOW" && !feedback && isPastEndTime && (
                     <div className="p-6 2xl:p-7 border-b border-white/5">
                        <div className="flex items-center gap-3 text-zinc-400 text-[13px]">
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
                        {/* Cancel session button for scheduled */}
                        {status === "SCHEDULED" && !isPastEndTime && (
                           <Button
                              variant="ghost"
                              className="cursor-pointer text-zinc-400 hover:text-rose-400 hover:bg-rose-500/5 text-xs rounded-lg h-9 max-sm:w-full"
                              onClick={() => setOpenDialogue(true)}
                              disabled={isCancelPending}
                           >
                              Cancel Session
                           </Button>
                        )}

                        {/* Join / Rejoin call button */}
                        {(status === "SCHEDULED" || status === "COMPLETED") && !isPastEndTime && streamCallId && streamStatus === "READY" && (
                           <Link href={`/call/${streamCallId}`} className="max-sm:w-full">
                              <Button className="cursor-pointer bg-violet-600 hover:bg-violet-700 text-zinc-100 text-xs rounded-lg h-9 px-4.5 font-semibold flex items-center gap-1.5 max-sm:w-full">
                                 <Video className="w-3.5 h-3.5" />
                                 {status === "COMPLETED" ? "Rejoin Interview" : "Join Interview"}
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
                              className="cursor-pointer bg-violet-600 hover:bg-violet-700 text-zinc-100 text-xs rounded-lg h-9 px-4.5 font-semibold shadow-lg flex items-center gap-1.5 max-sm:w-full"
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

         <ConfirmDialog
            open={openDialogue}
            onClose={() => setOpenDialogue(false)}
            onConfirm={() => void handleCancelSession()}
            title="Cancel Session"
            description="Are you sure you want to cancel the session? This action is permanent and irreversible. The candidate will be refunded their credits."
            isLoading={isCancelPending}
            confirmText="Confirm"
            variant="destructive"
         />
      </>
   );
};

export default SessionCard;
