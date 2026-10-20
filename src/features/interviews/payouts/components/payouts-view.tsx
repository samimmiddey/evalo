"use client";

import { useState } from "react";
import { useFetch } from "@/hooks/use-fetch";
import { getPayoutsData } from "../services/payout.client.service";
import { PayoutsData } from "../types/payout.types";
import { RequestPayoutModal } from "./request-payout-modal";
import { PayoutsSkeleton } from "./skeletons/payouts-skeleton";
import { Button } from "@/components/ui/button";
import { Coins, Wallet } from "lucide-react";
import CardLayout from "@/components/layouts/card-layout";
import PrimaryBody from "@/components/common/primary-body";
import SecondaryTitle from "@/components/common/secondary-title";
import { usePlatformConfig } from "@/hooks/use-config";
import ErrorCard from "@/components/common/error-card";
import EnhancedNoDataCard from "@/components/common/enhanced-no-data-card";
import { payoutsData } from "@/data/payouts/payouts.data";

export const PayoutsView = ({ onRefreshStats }: { onRefreshStats?: () => void; }) => {
   const [openRequestModal, setOpenRequestModal] = useState(false);
   const { walletCard, noData } = payoutsData;

   const {
      isLoading,
      data,
      error,
      refetch
   } = useFetch<PayoutsData>(() => getPayoutsData());

   const { config, isLoading: isConfigLoading, error: isConfigError } = usePlatformConfig();

   // Loading State
   if (isLoading || isConfigLoading) {
      return <PayoutsSkeleton />;
   }

   // Error State
   if (error || isConfigError) {
      return (
         <ErrorCard text={error ?? isConfigError ?? "Unable to load payout configuration"} />
      );
   }

   // No Data State
   if (!data || !config) {
      return (
         <EnhancedNoDataCard
            title={noData.title}
            body={noData.body}
         />
      );
   }

   const creditBalance = data.creditBalance;
   const ratePerCredit = config.creditPayoutRate;
   const platformFeePercent = config.platformFeePercent;

   const grossEstimated = creditBalance * ratePerCredit;
   const netEstimated = grossEstimated * (1 - platformFeePercent / 100);

   const handleSuccess = () => {
      void refetch();
      if (onRefreshStats) onRefreshStats();
   };

   return (
      <div className="space-y-6">
         {/* Wallet Card */}
         <CardLayout className="space-y-6 2xl:p-7 p-5 border-white/5!">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
               <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-violet-500/15 border border-violet-500/30 text-violet-300">
                     <Wallet className="w-5 h-5 text-violet-400" />
                  </div>
                  <div>
                     <PrimaryBody
                        text={walletCard.title}
                        className="text-xs! lg:text-xs! 2xl:text-xs! font-semibold uppercase tracking-wider text-zinc-400"
                     />
                     <div className="flex items-center gap-2">
                        <SecondaryTitle
                           text={`${creditBalance}`}
                           className="text-xl! font-bold! text-zinc-100!"
                        />
                        <span className="text-sm font-medium text-violet-300">
                           {creditBalance === 1 ? walletCard.singleAvailableLabel : walletCard.availableLabel}
                        </span>
                     </div>
                  </div>
               </div>

               <Button
                  size='lg'
                  disabled={creditBalance < 1}
                  onClick={() => setOpenRequestModal(true)}
                  className="bg-violet-600 hover:bg-violet-700 text-white gap-2 cursor-pointer disabled:opacity-50 max-sm:w-full"
               >
                  <Coins className="w-4 h-4" />
                  {walletCard.buttonText}
               </Button>
            </div>

            {/* Quick Math Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-white/5 text-xs">
               <div className="p-3 rounded-xl bg-zinc-900/40 border border-white/5">
                  <PrimaryBody text={walletCard.quickStats.rateConversionLabel} className="text-xs! lg:text-xs! 2xl:text-[13px]! text-zinc-500 mb-0.5" />
                  <PrimaryBody text={`₹${ratePerCredit}.00 ${walletCard.quickStats.rateConversionUnit}`} className="text-xs! lg:text-xs! 2xl:text-sm! font-semibold text-zinc-100" />
               </div>
               <div className="p-3 rounded-xl bg-zinc-900/40 border border-white/5">
                  <PrimaryBody text={walletCard.quickStats.platformFeeLabel} className="text-xs! lg:text-xs! 2xl:text-[13px]! text-zinc-500 mb-0.5" />
                  <PrimaryBody text={`${platformFeePercent}% ${walletCard.quickStats.platformFeeSubtext}`} className="text-xs! lg:text-xs! 2xl:text-sm! font-semibold text-zinc-100" />
               </div>
               <div className="p-3 rounded-xl bg-zinc-900/40 border border-white/5">
                  <PrimaryBody text={walletCard.quickStats.netCashValueLabel} className="text-xs! lg:text-xs! 2xl:text-[13px]! text-zinc-500 mb-0.5" />
                  <PrimaryBody text={`₹${netEstimated.toFixed(2)}`} className="text-xs! lg:text-xs! 2xl:text-sm! font-bold text-emerald-400" />
               </div>
            </div>
         </CardLayout>

         {/* Request Modal */}
         <RequestPayoutModal
            open={openRequestModal}
            onClose={() => setOpenRequestModal(false)}
            maxCredits={creditBalance}
            ratePerCredit={ratePerCredit}
            platformFeePercent={platformFeePercent}
            onSuccess={handleSuccess}
         />
      </div>
   );
};

export default PayoutsView;
