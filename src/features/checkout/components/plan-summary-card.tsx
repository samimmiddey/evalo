import { Check, Gem, IndianRupee, CreditCard } from "lucide-react";
import CardLayout from "@/components/layouts/card-layout";
import SecondaryTitle from "@/components/common/secondary-title";
import PrimaryBody from "@/components/common/primary-body";
import { CustomPlan } from "@/features/static/home/types/pricing.types";
import { checkoutData } from "@/data/checkout/checkout.data";

const PlanSummaryCard = ({ plan }: { plan: CustomPlan; }) => {
   const { planSummary } = checkoutData;

   return (
      <CardLayout className="space-y-6">
         {/* Plan Header */}
         <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-zinc-800/80">
            <div className="space-y-2">
               <div className="flex items-center gap-2.5">
                  <SecondaryTitle
                     text={plan.name}
                     className="text-xl! lg:text-2xl! font-bold text-zinc-100"
                  />
                  {
                     plan.isPopular && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.75 rounded-full bg-violet-500/20 border border-violet-500/30 text-violet-300 text-xs font-medium">
                           <Gem className="size-3 text-violet-300" />
                           {planSummary.popularBadge}
                        </span>
                     )
                  }
               </div>
               <PrimaryBody
                  text={plan.description}
                  className="text-[13px]! 2xl:text-sm! text-zinc-400 max-w-md leading-relaxed"
               />
            </div>

            <div className="sm:text-right shrink-0">
               <div className="flex items-baseline sm:justify-end gap-1">
                  <span className="text-3xl 2xl:text-4xl font-bold font-geist text-zinc-100 flex items-center">
                     <IndianRupee className="size-6 2xl:size-7.5" />
                     {plan.amount}
                  </span>
                  <span className="text-[13px]! 2xl:text-sm text-zinc-400 font-medium">/month</span>
               </div>
               <PrimaryBody
                  text={planSummary.billingCycle}
                  className="text-xs! text-zinc-500! mt-0.5"
               />
            </div>
         </div>

         {/* Credits Quota Banner */}
         <div className="rounded-xl border border-violet-500/20 bg-violet-500/10 p-5 flex max-sm:flex-col sm:items-center gap-4">
            <div className="flex size-10 2xl:size-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/20 text-violet-300 border border-violet-500/30">
               <CreditCard className="size-5" />
            </div>
            <div className="space-y-1">
               <SecondaryTitle
                  text={plan.credit}
                  className="text-base! 2xl:text-lg! font-semibold text-zinc-100"
               />
               <PrimaryBody
                  text={planSummary.creditsNote}
                  className="text-xs! text-zinc-400!"
               />
            </div>
         </div>

         {/* Features List */}
         <div className="space-y-3.5 pt-1">
            <PrimaryBody
               text={planSummary.featuresHeading}
               className="text-[11px]! 2xl:text-xs! font-semibold! tracking-wider! uppercase"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
               {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                     <div className="p-0.75 2xl:p-1 rounded-full bg-zinc-500/20 text-zinc-400 shrink-0">
                        <Check className="size-3" strokeWidth={3} />
                     </div>
                     <span className="text-[13px]! 2xl:text-sm text-zinc-300 leading-snug mt-px">
                        {feature}
                     </span>
                  </div>
               ))}
            </div>
         </div>
      </CardLayout>
   );
};

export default PlanSummaryCard;
