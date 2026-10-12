import { ArrowRight, IndianRupee, ShieldCheck } from "lucide-react";
import CardLayout from "@/components/layouts/card-layout";
import { Button } from "@/components/ui/button";
import SecondaryTitle from "@/components/common/secondary-title";
import PrimaryBody from "@/components/common/primary-body";
import { toast } from "sonner";
import { useEffect } from "react";
import { useMutation } from "@/hooks/use-mutation";
import { createSubscription } from "@/services/client/cashfree.client.service";
import { CustomPlan } from "@/features/static/home/types/pricing.types";
import CustomSpinner from "@/components/common/custom-spinner";
import { checkoutData } from "@/data/checkout/checkout.data";

const OrderSummaryCard = ({ plan }: { plan: CustomPlan; }) => {
   const { orderSummary } = checkoutData;
   const { isPending, error, mutate } = useMutation(createSubscription);

   const handleSubmit = async () => {
      const res = await mutate({
         id: plan.id,
         name: plan.name
      });

      if (res?.subscription_session_id && window.Cashfree) {
         toast.success("Redirecting to checkout...");

         const cashfree = window.Cashfree({
            mode: 'sandbox'
         });

         await cashfree.subscriptionsCheckout({
            subsSessionId: res.subscription_session_id,
            redirectTarget: "_self"
         });
      }
   };

   // Show error
   useEffect(() => {
      if (error) {
         toast.error('Failed to initialize subscription');
      }
   }, [error]);

   return (
      <CardLayout className="space-y-6 lg:sticky lg:top-24">
         {/* Card Title */}
         <div className="pb-4 border-b border-zinc-800/80">
            <SecondaryTitle
               text={orderSummary.title}
               className="text-lg! 2xl:text-xl! font-bold text-zinc-100"
            />
         </div>

         {/* Line Items */}
         <div className="space-y-3.5 text-[13px] 2xl:text-sm">
            <div className="flex items-center justify-between gap-2">
               <span className="text-zinc-300 font-medium">
                  {plan.name} Plan
               </span>
               <span className="text-zinc-100 font-semibold flex items-center">
                  <IndianRupee className="size-3" />
                  {plan.amount}
               </span>
            </div>

            <div className="flex items-center justify-between gap-2 text-zinc-400">
               <span>{orderSummary.labels.creditsQuota}</span>
               <span className="text-emerald-400 font-medium">
                  {plan.credit}
               </span>
            </div>

            <div className="flex items-center justify-between gap-2 text-zinc-400">
               <span>{orderSummary.labels.taxesAndFees}</span>
               <span className="text-zinc-300 font-medium">{orderSummary.labels.taxesStatus}</span>
            </div>
         </div>

         {/* Total Section */}
         <div className="pt-4 border-t border-zinc-800/80 space-y-1.5">
            <div className="flex items-baseline justify-between gap-2">
               <span className="text-sm 2xl:text-base font-semibold font-geist text-zinc-200">
                  {orderSummary.labels.totalDue}
               </span>
               <div className="text-right">
                  <span className="text-2xl 2xl:text-3xl font-bold font-geist text-zinc-100 flex items-center justify-end">
                     <IndianRupee className="size-5 2xl:size-6" />
                     {plan.amount}
                  </span>
                  <span className="text-xs text-zinc-500">{orderSummary.labels.billingCadence}</span>
               </div>
            </div>
         </div>

         {/* Checkout Action Button */}
         <div className="space-y-2.5">
            <Button
               size="lg"
               className="w-full h-auto py-3.5 rounded-lg text-sm bg-violet-600 hover:bg-violet-500 text-zinc-100 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
               disabled={isPending}
               onClick={() => void handleSubmit()}
            >
               {
                  isPending ? (
                     <CustomSpinner text={orderSummary.button.loadingText} />
                  ) : (
                     <>
                        <span>{orderSummary.button.text}</span>
                        <ArrowRight className="size-4" />
                     </>
                  )
               }
            </Button>
            <PrimaryBody
               text={orderSummary.mandateDisclaimer}
               className="text-[11px]! text-center! text-zinc-500! pt-1"
            />
         </div>

         {/* Cashfree Badge Note */}
         <div className="border-t border-zinc-800/60 flex items-center justify-center gap-1.5 pt-4 text-[11px] text-zinc-500">
            <ShieldCheck className="size-3.5 text-emerald-500" />
            <span>{orderSummary.securityBadge}</span>
         </div>
      </CardLayout>
   );
};

export default OrderSummaryCard;
