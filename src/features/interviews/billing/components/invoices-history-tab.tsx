"use client";

import { format, parseISO } from "date-fns";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { CashfreePaymentRecord } from "../types/billing.types";
import SecondaryTitle from "@/components/common/secondary-title";
import PrimaryBody from "@/components/common/primary-body";
import { billingData } from "@/data/billing/billing.data";

interface InvoicesHistoryTabProps {
   payments: CashfreePaymentRecord[];
}

export const InvoicesHistoryTab = ({ payments }: InvoicesHistoryTabProps) => {
   const { invoicesTab } = billingData;

   if (payments.length === 0) {
      return (
         <div className="p-8 text-center bg-zinc-900/40 border border-dashed border-white/10 rounded-2xl">
            <PrimaryBody
               text={invoicesTab.emptyTitle}
               className="text-xs! lg:text-xs! 2xl:text-[13px]! text-zinc-500!"
            />
         </div>
      );
   }

   const getPaymentStatusIcon = (status: string) => {
      switch (status) {
         case "SUCCESS":
            return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
         case "FAILED":
            return <XCircle className="w-4 h-4 text-rose-400" />;
         default:
            return <Clock className="w-4 h-4 text-amber-400" />;
      }
   };

   const getPaymentStatusBadge = (status: string) => {
      switch (status) {
         case "SUCCESS":
            return (
               <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-semibold rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  {invoicesTab.statusBadges.success}
               </span>
            );
         case "FAILED":
            return (
               <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-semibold rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30">
                  {invoicesTab.statusBadges.failed}
               </span>
            );
         default:
            return (
               <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-semibold rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
                  {status}
               </span>
            );
      }
   };

   return (
      <div className="space-y-2.5">
         {payments.map((payment) => {
            let formattedDate = "";
            try {
               formattedDate = format(parseISO(payment.paymentTime), "PPp");
            } catch {
               formattedDate = payment.paymentTime;
            }

            return (
               <div
                  key={payment.cfPaymentId || payment.paymentId}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-zinc-900/40 border border-white/5 hover:border-white/10 transition-colors"
               >
                  <div className="flex items-center gap-3 min-w-0">
                     <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-800 border border-white/5 shrink-0">
                        {getPaymentStatusIcon(payment.paymentStatus)}
                     </div>
                     <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                           <SecondaryTitle
                              text={`Payment #${payment.paymentId}`}
                              className="text-xs! 2xl:text-sm! truncate"
                           />
                           {getPaymentStatusBadge(payment.paymentStatus)}
                        </div>
                        <div className="flex items-center gap-2 text-zinc-500">
                           <PrimaryBody
                              text={formattedDate}
                              className="text-[11px]! lg:text-[11px]! 2xl:text-[11px]! text-zinc-500!"
                           />
                           {payment.paymentMethod && (
                              <>
                                 <span className="text-[11px] text-zinc-600">•</span>
                                 <span className="text-[11px] text-zinc-400 uppercase font-medium">
                                    {payment.paymentMethod}
                                 </span>
                              </>
                           )}
                        </div>
                     </div>
                  </div>

                  <div className="sm:text-right shrink-0">
                     <SecondaryTitle
                        text={`₹${payment.paymentAmount.toFixed(2)} ${payment.paymentCurrency}`}
                        className="text-sm! font-bold! text-zinc-100!"
                     />
                     <PrimaryBody
                        text={invoicesTab.subtext}
                        className="text-[11px]! lg:text-[11px]! text-zinc-500!"
                     />
                  </div>
               </div>
            );
         })}
      </div>
   );
};

export default InvoicesHistoryTab;
