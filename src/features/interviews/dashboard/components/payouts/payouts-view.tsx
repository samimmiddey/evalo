"use client";

import { useEffect, useState } from "react";
import { useFetch } from "@/hooks/use-fetch";
import { getPayoutsData } from "../../services/dashboard.client.service";
import { DashboardPayoutsData } from "../../types/dashboard.types";
import { PayoutHistoryList } from "./payout-history-list";
import { TransactionsHistory } from "./transactions-history";
import { RequestPayoutModal } from "./request-payout-modal";
import { PayoutsSkeleton } from "../skeletons/payouts-skeleton";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Coins, History, Layers, Wallet } from "lucide-react";
import CardLayout from "@/components/layouts/card-layout";
import PrimaryBody from "@/components/common/primary-body";
import SecondaryTitle from "@/components/common/secondary-title";
import {
   Tabs,
   TabsContent,
   TabsList,
   TabsTrigger
} from "@/components/ui/tabs";

export const PayoutsView = ({ onRefreshStats }: { onRefreshStats?: () => void; }) => {
   const [openRequestModal, setOpenRequestModal] = useState(false);
   const [activeSubTab, setActiveSubTab] = useState<"payouts" | "transactions">("payouts");

   const {
      isLoading,
      data,
      error,
      refetch
   } = useFetch<DashboardPayoutsData>(() => getPayoutsData());

   useEffect(() => {
      if (error) {
         toast.error(error);
      }
   }, [error]);

   if (isLoading) {
      return <PayoutsSkeleton />;
   }

   const creditBalance = data?.creditBalance ?? 0;
   const ratePerCredit = data?.ratePerCredit ?? 25;
   const platformFeePercent = data?.platformFeePercent ?? 10;

   const grossEstimated = creditBalance * ratePerCredit;
   const netEstimated = grossEstimated * (1 - platformFeePercent / 100);

   const handleSuccess = () => {
      void refetch();
      if (onRefreshStats) onRefreshStats();
   };

   return (
      <div className="space-y-6">
         {/* Wallet Card */}
         <CardLayout className="space-y-6 2xl:p-7 p-5 bg-zinc-900/40! border-white/5! hover:shadow-none">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
               <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-violet-500/15 border border-violet-500/30 text-violet-300">
                     <Wallet className="w-5 h-5 text-violet-400" />
                  </div>
                  <div>
                     <PrimaryBody
                        text="Credit Wallet Balance"
                        className="text-xs! lg:text-xs! 2xl:text-xs! font-semibold uppercase tracking-wider text-zinc-400"
                     />
                     <div className="flex items-center gap-2">
                        <SecondaryTitle
                           text={`${creditBalance}`}
                           className="text-xl! font-extrabold! text-white!"
                        />
                        <span className="text-sm font-medium text-violet-400">{`Credit${creditBalance > 1 ? 's' : ''}`}</span>
                     </div>
                  </div>
               </div>

               <Button
                  size='lg'
                  disabled={creditBalance < 1}
                  onClick={() => setOpenRequestModal(true)}
                  className="bg-violet-600 hover:bg-violet-500 text-white gap-2 cursor-pointer disabled:opacity-50 max-sm:w-full"
               >
                  <Coins className="w-4 h-4" />
                  Request Payout
               </Button>
            </div>

            {/* Quick Math Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-white/5 text-xs">
               <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/5">
                  <PrimaryBody text="Rate Conversion" className="text-xs! lg:text-xs! 2xl:text-xs! text-zinc-500 mb-0.5" />
                  <PrimaryBody text={`$${ratePerCredit}.00 USD / Credit`} className="text-xs! lg:text-xs! 2xl:text-xs! font-semibold text-zinc-200" />
               </div>
               <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/5">
                  <PrimaryBody text="Platform Service Fee" className="text-xs! lg:text-xs! 2xl:text-xs! text-zinc-500 mb-0.5" />
                  <PrimaryBody text={`${platformFeePercent}% on withdrawal`} className="text-xs! lg:text-xs! 2xl:text-xs! font-semibold text-zinc-200" />
               </div>
               <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/5">
                  <PrimaryBody text="Est. Net Cash Value" className="text-xs! lg:text-xs! 2xl:text-xs! text-zinc-500 mb-0.5" />
                  <PrimaryBody text={`$${netEstimated.toFixed(2)} USD`} className="text-xs! lg:text-xs! 2xl:text-xs! font-bold text-emerald-400" />
               </div>
            </div>
         </CardLayout>

         {/* Sub Tabs: Payout Requests vs Transactions */}
         <Tabs
            value={activeSubTab}
            onValueChange={(val) => setActiveSubTab(val as "payouts" | "transactions")}
            className="space-y-4"
         >
            <TabsList className="bg-zinc-900 border border-white/10 h-10! group-data-horizontal/tabs:h-10! p-1 gap-1.5 rounded-lg w-fit">
               <TabsTrigger
                  value="payouts"
                  className="h-full! py-2! px-3! gap-2 rounded-md data-active:bg-violet-600/20! data-active:text-violet-300! data-active:border-violet-500/30! data-active:border! text-zinc-400! hover:text-zinc-200! text-xs! font-semibold! transition-all! cursor-pointer!"
               >
                  <History className="w-3.5 h-3.5" />
                  <span>Payout Requests ({data?.payouts.length ?? 0})</span>
               </TabsTrigger>

               <TabsTrigger
                  value="transactions"
                  className="h-full! py-2! px-3! gap-2 rounded-md data-active:bg-violet-600/20! data-active:text-violet-300! data-active:border-violet-500/30! data-active:border! text-zinc-400! hover:text-zinc-200! text-xs! font-semibold! transition-all! cursor-pointer!"
               >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Credit Transactions ({data?.transactions.length ?? 0})</span>
               </TabsTrigger>
            </TabsList>

            <TabsContent value="payouts">
               <PayoutHistoryList payouts={data?.payouts ?? []} />
            </TabsContent>

            <TabsContent value="transactions">
               <TransactionsHistory transactions={data?.transactions ?? []} />
            </TabsContent>
         </Tabs>

         {/* Request Modal */}
         <RequestPayoutModal
            open={openRequestModal}
            onClose={() => setOpenRequestModal(false)}
            maxCredits={creditBalance}
            onSuccess={handleSuccess}
         />
      </div>
   );
};

export default PayoutsView;
