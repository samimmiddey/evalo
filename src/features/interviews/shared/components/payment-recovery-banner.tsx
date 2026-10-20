"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { useAppUser } from "@/hooks/use-app-user";
import SecondaryTitle from "@/components/common/secondary-title";
import PrimaryBody from "@/components/common/primary-body";
import { PRO, STARTER } from "@/constants/cashfree";
import { cn } from "@/lib/utils";
import { billingData } from "@/data/billing/billing.data";

interface PaymentRecoveryBannerProps {
   className?: string;
}

export const PaymentRecoveryBanner = ({ className }: PaymentRecoveryBannerProps) => {
   const { user } = useAppUser();
   const { paymentRecoveryBanner } = billingData;

   if (user?.subscriptionStatus !== "ON_HOLD") {
      return null;
   }

   const checkoutPlanId = user?.currentPlan?.toLowerCase() === "pro" ? PRO : STARTER;

   return (
      <div
         className={cn(
            "flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-amber-500/20 bg-amber-500/10 p-5 sm:p-4",
            className
         )}
      >
         <div className="flex items-center max-sm:flex-col max-sm:text-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
               <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
               <SecondaryTitle
                  text={paymentRecoveryBanner.title}
                  className="text-[15px]! font-medium text-amber-200 mb-1"
               />
               <PrimaryBody
                  text={paymentRecoveryBanner.body}
                  className="text-xs lg:text-xs 2xl:text-[13px] text-amber-100/90"
               />
            </div>
         </div>
         <div className="shrink-0 max-sm:w-full flex justify-end">
            <Link
               href={`/checkout/${checkoutPlanId}`}
               className="relative inline-flex h-9 overflow-hidden rounded-lg p-0.5 focus:outline-none max-sm:w-full"
            >
               {/* Flowing border colors: seamless loop, no hard edge */}
               <span className="absolute inset-[-1000%] animate-[spin_4s_linear_infinite_reverse] bg-[conic-gradient(from_0deg,#fde047,#ea580c,#fde047,#ea580c,#fde047)]" />

               {/* Static gradient body */}
               <span className="relative inline-flex h-full w-full items-center justify-center rounded-md bg-linear-to-r from-yellow-400 to-orange-500 px-4 text-sm font-semibold text-zinc-950 transition-opacity hover:opacity-90">
                  {paymentRecoveryBanner.buttonText}
               </span>
            </Link>
         </div>
      </div>
   );
};

export default PaymentRecoveryBanner;
