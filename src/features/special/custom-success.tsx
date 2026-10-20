"use client";

import Link from "next/link";
import { CheckCircle2, ArrowRight, Brain, ShieldCheck, CalendarCheck, Zap, Loader2, XCircle, Clock, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import PrimaryTitle from "@/components/common/primary-title";
import PrimaryBody from "@/components/common/primary-body";
import SecondaryTitle from "@/components/common/secondary-title";
import { useFetch } from "@/hooks/use-fetch";
import { getSubscription } from "@/services/client/cashfree.client.service";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { SubscriptionStatus } from "@/generated/prisma/enums";

const MAX_ATTEMPTS = 2;

const CustomSuccess = ({ id }: { id: string; }) => {
   const [isPollingLoading, setIsPollingLoading] = useState<boolean>(true);
   const [attempts, setAttempts] = useState<number>(0);

   const { isLoading, data, error, refetch } = useFetch(() => getSubscription(id));

   const isFailed =
      data?.subscription_status === SubscriptionStatus.CANCELLED ||
      data?.subscription_status === SubscriptionStatus.EXPIRED;

   // Show error
   useEffect(() => {
      if (error && !isPollingLoading) {
         toast.error(error);
      }
   }, [error, isPollingLoading]);

   // Create polling to check subscription status
   useEffect(() => {
      // Stop polling if process failed
      if (isFailed) return;

      // Stop polling once subscription is active
      if (data?.subscription_status === SubscriptionStatus.ACTIVE) {
         // eslint-disable-next-line react-hooks/set-state-in-effect
         setIsPollingLoading(false);
         return;
      };

      if (attempts >= MAX_ATTEMPTS) {
         setIsPollingLoading(false);
         return;
      }

      const interval = setInterval(() => {
         setAttempts(prevState => prevState + 1);
         void refetch();
      }, 5000);

      return () => clearInterval(interval);
   }, [data, id, refetch, attempts, isFailed]);

   // Loading State
   if ((isLoading || isPollingLoading) && !isFailed) {
      return (
         <StatusCardSkeleton />
      );
   }

   // 2. Mandate Failed or Cancelled
   if (isFailed) {
      return <CustomFailedCard />;
   }

   // 3. Timed out without reaching ACTIVE
   if (attempts >= MAX_ATTEMPTS && data?.subscription_status !== SubscriptionStatus.ACTIVE) {
      return <CustomPendingCard onRetry={() => { void refetch(); }} />;
   }

   return (
      <CustomSuccessCard />
   );
};

type CardStatus = "success" | "failed" | "pending" | "loading";

const GLOW_CONFIG: Record<CardStatus, { top: string; bottom: string; }> = {
   success: {
      top: "bg-emerald-500/10",
      bottom: "bg-violet-500/10",
   },
   failed: {
      top: "bg-rose-500/10",
      bottom: "bg-red-500/10",
   },
   pending: {
      top: "bg-amber-500/10",
      bottom: "bg-orange-500/10",
   },
   loading: {
      top: "bg-zinc-600/15",
      bottom: "bg-zinc-700/10",
   },
};

// Common card layout
const Layout = ({ children, status = "success" }: { children: React.ReactNode; status?: CardStatus; }) => {
   const glow = GLOW_CONFIG[status];

   return (
      <main className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden bg-zinc-950">
         {/* Background Glows */}
         <div className={`absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 size-96 sm:size-125 ${glow.top} rounded-full blur-3xl pointer-events-none transition-colors duration-500`} />
         <div className={`absolute bottom-1/4 left-1/2 -translate-x-1/2 translate-y-1/2 size-80 sm:size-100 ${glow.bottom} rounded-full blur-3xl pointer-events-none transition-colors duration-500`} />
         {children}
      </main>
   );
};

interface StatusCardProps {
   icon: React.ReactNode;
   iconContainerClassName: string;
   badgeText: string;
   badgeClassName: string;
   title: string;
   description: string;
   children?: React.ReactNode;
   actions: React.ReactNode;
   status?: CardStatus;
}

// Main usable card
const StatusCard = ({
   icon,
   iconContainerClassName,
   badgeText,
   badgeClassName,
   title,
   description,
   children,
   actions,
   status = "success",
}: StatusCardProps) => {
   return (
      <Layout status={status}>
         <div className="relative w-full max-w-lg z-10">
            <div className="relative rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
               {/* Icon */}
               <div className={`mx-auto flex size-16 items-center justify-center rounded-full mb-6 ${iconContainerClassName}`}>
                  {icon}
               </div>

               {/* Header */}
               <div className="text-center space-y-2 mb-6 2xl:mb-7">
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-medium mb-4 ${badgeClassName}`}>
                     {badgeText}
                  </div>

                  <PrimaryTitle
                     text={title}
                     className="text-xl sm:text-2xl lg:text-2xl 2xl:text-3xl text-zinc-100 font-geist"
                  />

                  <PrimaryBody
                     text={description}
                     className="max-w-sm mx-auto text-center text-[13px]! 2xl:text-sm!"
                  />
               </div>

               {/* Content */}
               {children}

               {/* Action Buttons */}
               <div className="flex flex-col sm:flex-row gap-3">
                  {actions}
               </div>

               {/* Security Footer Note */}
               <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-zinc-400">
                  <ShieldCheck className="size-3.5 text-emerald-500" />
                  <span>Secured by Cashfree Payments</span>
               </div>
            </div>
         </div>
      </Layout>
   );
};

// Success card
export const CustomSuccessCard = () => {
   return (
      <StatusCard
         status="success"
         icon={<CheckCircle2 className="size-9 text-emerald-400" />}
         iconContainerClassName="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.2)]"
         badgeText="Payment & Mandate Confirmed"
         badgeClassName="border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
         title="Subscription Active!"
         description="Thank you! Your payment mandate has been authorized and your interview credits are ready to use."
         actions={
            <>
               <Button asChild size="lg" className="flex-1 w-full bg-emerald-500! hover:bg-emerald-400! text-zinc-950 font-medium">
                  <Link href="/dashboard" className="flex items-center justify-center gap-2">
                     Go to Dashboard
                     <ArrowRight className="size-4" />
                  </Link>
               </Button>

               <Button asChild variant="outline" size="lg" className="flex-1 w-full border-zinc-700 hover:bg-zinc-800 text-zinc-200">
                  <Link href="/dashboard/interviewers">
                     Find Interviewers
                  </Link>
               </Button>
            </>
         }
      >
         <div className="rounded-xl border border-zinc-800/60 bg-zinc-950/40 p-4 space-y-3 mb-8">
            <div className="flex items-center gap-3">
               <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Zap className="size-4" />
               </div>
               <div className="space-y-0.5">
                  <SecondaryTitle text="Credits Credited" className="text-sm 2xl:text-base font-medium" />
                  <p className="text-xs text-zinc-400">Monthly interview quota added to your balance</p>
               </div>
            </div>

            <div className="flex items-center gap-3">
               <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <CalendarCheck className="size-4" />
               </div>
               <div className="space-y-0.5">
                  <SecondaryTitle text="Instant Booking" className="text-sm 2xl:text-base font-medium" />
                  <p className="text-xs text-zinc-400">Schedule mock interviews with vetted engineers</p>
               </div>
            </div>

            <div className="flex items-center gap-3">
               <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <Brain className="size-4" />
               </div>
               <div className="space-y-0.5">
                  <SecondaryTitle text="AI Detailed Feedback" className="text-sm 2xl:text-base font-medium" />
                  <p className="text-xs text-zinc-400">Personalized scorecard and interview evaluation report</p>
               </div>
            </div>
         </div>
      </StatusCard>
   );
};

// Failure status card
export const CustomFailedCard = () => {
   return (
      <StatusCard
         status="failed"
         icon={<XCircle className="size-9 text-rose-400" />}
         iconContainerClassName="bg-rose-500/10 border border-rose-500/20 text-rose-400 shadow-[0_0_30px_rgba(244,63,94,0.2)]"
         badgeText="Mandate Cancelled / Failed"
         badgeClassName="border-rose-500/20 bg-rose-500/10 text-rose-300"
         title="Payment Authorization Failed"
         description="Your recurring payment mandate could not be authorized by your bank or was declined. No funds were deducted."
         actions={
            <>
               <Button asChild size="lg" className="flex-1 w-full bg-rose-600! hover:bg-rose-500! text-white font-medium">
                  <Link href="/pricing" className="flex items-center justify-center gap-2">
                     Try Again
                     <ArrowRight className="size-4" />
                  </Link>
               </Button>

               <Button asChild variant="outline" size="lg" className="flex-1 w-full border-zinc-700 hover:bg-zinc-800 text-zinc-200">
                  <Link href="/dashboard">
                     Go to Dashboard
                  </Link>
               </Button>
            </>
         }
      >
         <div className="rounded-xl border border-zinc-800/60 bg-zinc-950/40 p-4 space-y-2.5 mb-8 text-xs text-zinc-400">
            <p className="text-zinc-300 font-medium">Common reasons for mandate failures:</p>
            <ul className="list-disc list-inside space-y-1 text-zinc-400">
               <li>Standing instructions or recurring debits disabled on card/UPI</li>
               <li>Bank authentication timed out or OTP/PIN was cancelled</li>
               <li>Bank limit or debit card type not supported for recurring debits</li>
            </ul>
         </div>
      </StatusCard>
   );
};

// Pending status card
export const CustomPendingCard = ({ onRetry }: { onRetry: () => void; }) => {
   return (
      <StatusCard
         status="pending"
         icon={<Clock className="size-9 text-amber-400" />}
         iconContainerClassName="bg-amber-500/10 border border-amber-500/20 text-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.2)]"
         badgeText="Verification Under Processing"
         badgeClassName="border-amber-500/20 bg-amber-500/10 text-amber-300"
         title="Mandate Confirmation Pending"
         description="Your bank is taking longer than usual to confirm the subscription. We are tracking the status in the background."
         actions={
            <>
               <Button asChild size="lg" className="flex-1 w-full bg-amber-500! hover:bg-amber-400! text-zinc-950 font-medium">
                  <Link href="/dashboard" className="flex items-center justify-center gap-2">
                     Go to Dashboard
                     <ArrowRight className="size-4" />
                  </Link>
               </Button>

               <Button
                  variant="outline"
                  size="lg"
                  onClick={onRetry}
                  className="flex-1 w-full border-zinc-700 hover:bg-zinc-800 text-zinc-200 cursor-pointer"
               >
                  <RefreshCw className="size-4 mr-1.5" />
                  Check Again
               </Button>
            </>
         }
      >
         <div className="rounded-xl border border-zinc-800/60 bg-zinc-950/40 p-4 space-y-2.5 mb-8 text-xs text-zinc-400">
            <div className="flex items-start gap-2.5">
               <span className="size-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
               <span>Your interview credits will be added automatically once bank approval is received.</span>
            </div>
            <div className="flex items-start gap-2.5">
               <span className="size-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
               <span>You can safely leave this page — we will update your dashboard balance immediately.</span>
            </div>
         </div>
      </StatusCard>
   );
};

// Status card skeleton
export const StatusCardSkeleton = () => {
   return (
      <Layout status="loading">
         <div className="relative w-full max-w-lg z-10">
            <div className="relative rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
               {/* Animated Spinner Icon */}
               <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-zinc-800/80 border border-zinc-700/80 text-zinc-300 mb-6 shadow-[0_0_30px_rgba(113,113,122,0.15)]">
                  <Loader2 className="size-8 text-zinc-300 animate-spin" />
               </div>

               {/* Dynamic Header Feedback */}
               <div className="text-center space-y-2 mb-6 2xl:mb-7">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-700/80 bg-zinc-800/60 text-zinc-300 text-xs font-medium mb-4">
                     Payment in Verification
                  </div>

                  <PrimaryTitle
                     text='Authorizing Subscription'
                     className="text-xl sm:text-2xl lg:text-2xl 2xl:text-3xl text-zinc-100 font-geist transition-opacity duration-300"
                  />

                  <PrimaryBody
                     text='Finalizing authorization details with Cashfree...'
                     className="max-w-sm mx-auto text-center text-[13px]! 2xl:text-sm! transition-opacity duration-300"
                  />
               </div>

               {/* Perks Skeleton */}
               <div className="rounded-xl border border-zinc-800/60 bg-zinc-950/40 p-4 space-y-3 mb-8 animate-pulse">
                  {Array.from({ length: 3 }).map((_, i) => (
                     <div key={i} className="flex items-center gap-3">
                        <div className="size-8 rounded-lg bg-zinc-800 shrink-0" />
                        <div className="space-y-1.5 grow">
                           <div className="h-4 w-28 rounded bg-zinc-800" />
                           <div className="h-3 w-48 max-w-full rounded bg-zinc-800/60" />
                        </div>
                     </div>
                  ))}
               </div>

               {/* Actions Skeleton */}
               <div className="flex flex-col sm:flex-row gap-3 animate-pulse">
                  <div className="h-9 flex-1 rounded-lg bg-zinc-800" />
                  <div className="h-9 flex-1 rounded-lg bg-zinc-800/60" />
               </div>

               {/* Footer Note */}
               <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-zinc-500">
                  <ShieldCheck className="size-3.5 text-zinc-500" />
                  <span>Secured by Cashfree Payments</span>
               </div>
            </div>
         </div>
      </Layout>
   );
};

export default CustomSuccess;

