"use client";

import { Coins } from "lucide-react";
import CardLayout from "@/components/layouts/card-layout";
import PrimaryBody from "@/components/common/primary-body";
import SecondaryTitle from "@/components/common/secondary-title";
import { CandidateCreditInfo } from "../types/billing.types";
import { billingData } from "@/data/billing/billing.data";

interface CreditWalletCardProps {
   credit: CandidateCreditInfo;
   periodStart?: string | null;
}

export const CreditWalletCard = ({
   credit
}: CreditWalletCardProps) => {
   const { creditWalletCard } = billingData;
   const creditsUsed = credit.creditsUsed ?? 0;

   return (
      <CardLayout className="relative overflow-hidden h-full flex flex-col justify-between 2xl:p-7 p-5 bg-linear-to-br from-emerald-950/30 via-zinc-900/60 to-zinc-950 border-emerald-500/20! shadow-lg shadow-emerald-950/20">
         {/* Atmospheric Ambient Glow & Watermark */}
         <div className="absolute -top-12 -right-12 size-36 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
         <div className="absolute -bottom-10 -left-10 size-28 rounded-full bg-teal-500/10 blur-2xl pointer-events-none" />
         <Coins className="absolute -bottom-5 -right-5 size-36 text-emerald-500/4 pointer-events-none -rotate-12" />

         {/* Hero Balance Section */}
         <div className="flex items-start gap-4 justify-between">
            <div className="relative z-10 my-auto pb-5">
               <div className="flex items-baseline gap-2.5">
                  <SecondaryTitle
                     text={`${credit.credits}`}
                     className="text-4xl! 2xl:text-5xl! font-black! tracking-tight text-zinc-100!"
                  />
                  <span className="text-sm 2xl:text-base font-semibold text-emerald-400 tracking-wide">
                     {credit.credits === 1
                        ? creditWalletCard.singleAvailableLabel
                        : creditWalletCard.availableLabel}
                  </span>
               </div>
               <PrimaryBody
                  text={creditWalletCard.description}
                  className="text-xs! text-emerald-200/80 mt-1.5"
               />
            </div>
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-linear-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 text-emerald-400 shadow-inner shrink-0">
               <Coins className="w-5 h-5 text-emerald-300" />
            </div>
         </div>

         {/* Bottom Inset Stat */}
         <div className="relative z-10 p-3 rounded-xl bg-zinc-950/40 border border-white/5 backdrop-blur-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
               <PrimaryBody
                  text={creditWalletCard.usedLabel}
                  className="text-xs! lg:text-xs! 2xl:text-[13px]! text-zinc-200"
               />
            </div>
            <PrimaryBody
               text={`${creditsUsed} ${creditsUsed === 1 ? "Credit" : "Credits"}`}
               className="text-xs! lg:text-xs! 2xl:text-[13px]! font-bold text-zinc-200"
            />
         </div>
      </CardLayout>
   );
};

export default CreditWalletCard;
