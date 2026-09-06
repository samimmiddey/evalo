"use client";

import { AlertCircle, ArrowRight, CheckCircle2, Ban } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import CardLayout from '@/components/layouts/card-layout';
import SecondaryTitle from '@/components/common/secondary-title';
import PrimaryBody from '@/components/common/primary-body';

interface CallExpiredProps {
   isInterviewer: boolean;
   onNavigateOut: () => void;
   status?: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
}

const CallExpired = ({
   isInterviewer,
   onNavigateOut,
   status = 'SCHEDULED',
}: CallExpiredProps) => {
   const isCompleted = status === 'COMPLETED';
   const isCancelled = status === 'CANCELLED';

   const getIcon = () => {
      if (isCompleted) {
         return (
            <div className="flex items-center justify-center size-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 mb-2 shadow-inner">
               <CheckCircle2 className="size-6" />
            </div>
         );
      }
      if (isCancelled) {
         return (
            <div className="flex items-center justify-center size-12 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 mb-2 shadow-inner">
               <Ban className="size-6" />
            </div>
         );
      }
      return (
         <div className="flex items-center justify-center size-12 rounded-xl bg-zinc-500/15 border border-white/10 text-zinc-400 mb-2 shadow-inner">
            <AlertCircle className="size-6" />
         </div>
      );
   };

   const getBadge = () => {
      if (isCompleted) {
         return (
            <Badge variant="outline" className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-xs p-2.5 font-normal">
               Session Completed
            </Badge>
         );
      }
      if (isCancelled) {
         return (
            <Badge variant="outline" className="bg-rose-500/15 text-rose-400 border-rose-500/30 text-xs p-2.5 font-normal">
               Session Cancelled
            </Badge>
         );
      }
      return (
         <Badge variant="outline" className="bg-zinc-500/15 text-zinc-400 border-white/10 text-xs p-2.5 font-normal">
            Session Expired
         </Badge>
      );
   };

   const getTitle = () => {
      if (isCompleted) return 'Interview Completed';
      if (isCancelled) return 'Interview Cancelled';
      return 'Interview Expired';
   };

   const getDescription = () => {
      if (isCompleted) {
         return 'This interview call has already ended. Feedback and performance notes are available in your account.';
      }
      if (isCancelled) {
         return 'This interview appointment was cancelled. You can browse available interviewers to book a new session.';
      }
      return 'The scheduled time window for this interview session has passed and the room is now closed.';
   };

   return (
      <div className="flex flex-col items-center justify-center min-h-dvh w-full p-4 sm:p-6 bg-zinc-950 text-zinc-100 selection:bg-violet-500/30">
         <CardLayout className="flex flex-col items-center text-center gap-3 max-w-125 w-full">
            {getIcon()}

            {getBadge()}

            <div className="space-y-1 mt-1 flex flex-col gap-1">
               <SecondaryTitle
                  text={getTitle()}
                  className="text-lg! 2xl:text-lg! font-semibold! text-zinc-100!"
               />
               <PrimaryBody
                  text={getDescription()}
                  className="text-xs! lg:text-xs! 2xl:text-sm! text-zinc-400! leading-relaxed"
               />
            </div>

            {/* Action Button */}
            <Button
               type="button"
               size="lg"
               onClick={onNavigateOut}
               className="mt-4 w-full h-11 rounded-lg bg-violet-600 hover:bg-violet-700 text-white font-medium transition-all gap-2 group"
            >
               <span>{isInterviewer ? 'Return to Dashboard' : 'View Your Appointments'}</span>
               <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
            </Button>
         </CardLayout>
      </div>
   );
};

export default CallExpired;
