"use client";

import { CreditCard, Plus, X } from "lucide-react";
import CardLayout from "@/components/layouts/card-layout";
import PrimaryBody from "@/components/common/primary-body";
import SecondaryTitle from "@/components/common/secondary-title";
import { Button } from "@/components/ui/button";
import { BillingPlanInfo } from "../types/billing.types";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { billingData } from "@/data/billing/billing.data";
import { Badge } from "@/components/ui/badge";

interface SubscriptionPlanCardProps {
   plan: BillingPlanInfo;
   onUpgrade: () => void;
   onCancel: () => void;
}

export const SubscriptionPlanCard = ({
   plan,
   onUpgrade,
   onCancel
}: SubscriptionPlanCardProps) => {
   const { subscriptionCard } = billingData;

   const isSubscribed = plan.status === "ACTIVE" || plan.status === "ON_HOLD" || plan.status === "BANK_APPROVAL_PENDING";

   const isOnHold = plan.status === "ON_HOLD";

   const getStatusBadge = () => {
      switch (plan.status) {
         case "ON_HOLD":
            return (
               <Badge className="p-2.5 text-xs rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
                  {subscriptionCard.statusBadges.onHold}
               </Badge>
            );
         case "BANK_APPROVAL_PENDING":
            return (
               <Badge className="p-2.5 text-xs rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30">
                  {subscriptionCard.statusBadges.bankPending}
               </Badge>
            );
         case "CANCELLED":
            return (
               <Badge className="p-2.5 text-xs rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30">
                  {subscriptionCard.statusBadges.cancelled}
               </Badge>
            );
         case "ACTIVE":
         default:
            return (
               <Badge className="p-2.5 text-xs rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  {subscriptionCard.statusBadges.active}
               </Badge>
            );
      }
   };

   return (
      <CardLayout className="space-y-6 2xl:p-7 p-5 border-white/5!">
         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
               <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-violet-500/15 border border-violet-500/30 text-violet-300 shrink-0">
                  <CreditCard className="w-5 h-5 text-violet-400" />
               </div>
               <div>
                  <PrimaryBody
                     text={subscriptionCard.title}
                     className="text-xs! lg:text-xs! 2xl:text-xs! font-semibold uppercase tracking-wider text-zinc-400 mb-1"
                  />
                  <div className="flex flex-wrap items-center gap-2.5">
                     <SecondaryTitle
                        text={plan.planName}
                        className="text-[15px]! 2xl:text-base! font-bold! text-zinc-100!"
                     />
                     {getStatusBadge()}
                  </div>
               </div>
            </div>

            <div className="flex items-center gap-2 max-sm:w-full">
               <Button
                  onClick={onUpgrade}
                  className={cn(
                     "gap-1.5 cursor-pointer max-sm:w-full text-xs font-semibold rounded-lg h-9 px-4",
                     isSubscribed
                        ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-white/10"
                        : "bg-violet-600 hover:bg-violet-700 text-white"
                  )}
               >
                  <Plus className="w-3.5 h-3.5" />
                  <span>
                     {isSubscribed
                        ? subscriptionCard.buttons.change
                        : subscriptionCard.buttons.upgrade}
                  </span>
               </Button>

               {isSubscribed && (
                  <Button
                     variant="ghost"
                     size="sm"
                     onClick={onCancel}
                     className="text-xs rounded-lg h-9 px-3 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 cursor-pointer"
                  >
                     <X className="w-3.5 h-3.5 mr-1" />
                     <span>{subscriptionCard.buttons.cancel}</span>
                  </Button>
               )}
            </div>
         </div>

         {/* Quick Details Grid */}
         <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-white/5 text-xs">
            <div className="p-3 rounded-xl bg-zinc-900/40 border border-white/5">
               <PrimaryBody
                  text={subscriptionCard.quickStats.recurringCostLabel}
                  className="text-xs! lg:text-xs! 2xl:text-[13px]! text-zinc-500 mb-0.5"
               />
               <SecondaryTitle
                  text={
                     plan.recurringAmount && plan.recurringAmount > 0
                        ? `₹${plan.recurringAmount}.00 / month`
                        : subscriptionCard.quickStats.freeCostText
                  }
                  className="text-xs! lg:text-xs! 2xl:text-sm! font-semibold! text-zinc-100!"
               />
            </div>
            <div className="p-3 rounded-xl bg-zinc-900/40 border border-white/5">
               <PrimaryBody
                  text={subscriptionCard.quickStats.renewalDateLabel}
                  className="text-xs! lg:text-xs! 2xl:text-[13px]! text-zinc-500 mb-0.5"
               />
               <SecondaryTitle
                  text={
                     plan.currentPeriodEnd
                        ? format(parseISO(plan.currentPeriodEnd), "PP")
                        : isSubscribed
                           ? subscriptionCard.quickStats.renewsMonthlyText
                           : subscriptionCard.quickStats.noRenewalText
                  }
                  className={cn(
                     "text-xs! lg:text-xs! 2xl:text-sm! font-semibold!",
                     isOnHold ? "text-amber-400!" : "text-zinc-100!"
                  )}
               />
            </div>
            <div className="p-3 rounded-xl bg-zinc-900/40 border border-white/5">
               <PrimaryBody
                  text={subscriptionCard.quickStats.allowanceLabel}
                  className="text-xs! lg:text-xs! 2xl:text-[13px]! text-zinc-500 mb-0.5"
               />
               <SecondaryTitle
                  text={
                     plan.planSlug === "pro"
                        ? subscriptionCard.quickStats.proAllowanceText
                        : plan.planSlug === "starter"
                           ? subscriptionCard.quickStats.starterAllowanceText
                           : subscriptionCard.quickStats.freeAllowanceText
                  }
                  className="text-xs! lg:text-xs! 2xl:text-sm! font-semibold! text-zinc-100!"
               />
            </div>
         </div>
      </CardLayout>
   );
};

export default SubscriptionPlanCard;
