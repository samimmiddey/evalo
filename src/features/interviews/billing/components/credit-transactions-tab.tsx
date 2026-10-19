"use client";

import { format, parseISO } from "date-fns";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { CandidateCreditTransaction } from "../types/billing.types";
import SecondaryTitle from "@/components/common/secondary-title";
import PrimaryBody from "@/components/common/primary-body";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { billingData } from "@/data/billing/billing.data";
import EnhancedNoDataCard from "@/components/common/enhanced-no-data-card";

interface CreditTransactionsTabProps {
   transactions: CandidateCreditTransaction[];
}

export const CreditTransactionsTab = ({ transactions }: CreditTransactionsTabProps) => {
   const { transactionsTab } = billingData;

   if (transactions.length === 0) {
      return (
         <EnhancedNoDataCard
            title={transactionsTab.emptyTitle}
            body={transactionsTab.emptyDescription}
         />
      );
   }

   const getTransactionLabel = (tx: CandidateCreditTransaction) => {
      switch (tx.type) {
         case "CREDIT_PURCHASE":
            return transactionsTab.typeLabels.creditPurchase;
         case "BOOKING_DEDUCTION":
            return tx.interviewerName
               ? `Mock Interview with ${tx.interviewerName}`
               : transactionsTab.typeLabels.bookingDeductionDefault;
         case "BOOKING_REFUND":
            return transactionsTab.typeLabels.bookingRefund;
         case "BOOKING_REVERSAL":
            return transactionsTab.typeLabels.bookingReversal;
         case "ADMIN_ADJUSTMENT":
            return transactionsTab.typeLabels.adminAdjustment;
         default:
            return tx.type;
      }
   };

   return (
      <div className="space-y-2.5">
         {transactions.map((tx) => {
            const isPositive = tx.amount > 0;

            return (
               <div
                  key={tx.id}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-900/40 border border-white/5 hover:border-white/10 transition-colors"
               >
                  <div className="flex items-center gap-3 min-w-0">
                     <div
                        className={cn(
                           "flex items-center justify-center w-8 h-8 rounded-lg border shrink-0",
                           isPositive
                              ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                              : "bg-rose-500/15 border-rose-500/30 text-rose-400"
                        )}
                     >
                        {isPositive ? (
                           <ArrowDownLeft className="w-4 h-4" />
                        ) : (
                           <ArrowUpRight className="w-4 h-4" />
                        )}
                     </div>
                     <div className="min-w-0">
                        <SecondaryTitle
                           text={getTransactionLabel(tx)}
                           className="text-xs! 2xl:text-sm! mb-0.5 truncate"
                        />
                        <div className="flex items-center gap-2 text-zinc-500">
                           <PrimaryBody
                              text={format(parseISO(tx.createdAt), "PPp")}
                              className="text-[11px]! lg:text-[11px]! 2xl:text-[11px]! text-zinc-500!"
                           />
                           {tx.bookingId && (
                              <>
                                 <span className="text-[11px] text-zinc-600">•</span>
                                 <Link
                                    href="/dashboard/appointments"
                                    className="text-[11px] text-violet-400 hover:text-violet-300 underline underline-offset-2"
                                 >
                                    {transactionsTab.typeLabels.viewAppointment}
                                 </Link>
                              </>
                           )}
                        </div>
                     </div>
                  </div>

                  <span
                     className={cn(
                        "text-sm font-bold shrink-0 ml-3",
                        isPositive ? "text-emerald-400" : "text-rose-400"
                     )}
                  >
                     {isPositive ? `+${tx.amount}` : tx.amount} Credits
                  </span>
               </div>
            );
         })}
      </div>
   );
};

export default CreditTransactionsTab;
