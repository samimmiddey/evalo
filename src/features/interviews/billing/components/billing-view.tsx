"use client";

import { useState } from "react";
import { useFetch } from "@/hooks/use-fetch";
import { useMutation } from "@/hooks/use-mutation";
import { useAppUser } from "@/hooks/use-app-user";
import useUIStore from "@/store/ui-store";
import { getBillingData, cancelSubscription } from "../services/billing.client.service";
import { BillingData } from "../types/billing.types";
import SubscriptionPlanCard from "./subscription-plan-card";
import CreditWalletCard from "./credit-wallet-card";
import BillingSkeleton from "./skeletons/billing-skeleton";
import PaymentRecoveryBanner from "@/features/interviews/shared/components/payment-recovery-banner";
import ErrorCard from "@/components/common/error-card";
import EnhancedNoDataCard from "@/components/common/enhanced-no-data-card";
import ConfirmDialog from "@/components/common/confirm-dialog";
import { toast } from "sonner";
import { billingData } from "@/data/billing/billing.data";

export const BillingView = () => {
   const { cancelModal, noData } = billingData;
   const [openCancelModal, setOpenCancelModal] = useState(false);

   const { setUpgradeModal } = useUIStore();
   const { refetch: refetchUser } = useAppUser();

   const {
      isLoading,
      data,
      error,
      refetch
   } = useFetch<BillingData>(() => getBillingData());

   const { isPending: isCancelPending, mutate: mutateCancel } = useMutation(cancelSubscription);

   // Loading State
   if (isLoading) {
      return <BillingSkeleton />;
   }

   // Error State
   if (error) {
      return <ErrorCard text={error} />;
   }

   // No Data State
   if (!data) {
      return (
         <EnhancedNoDataCard
            title={noData.title}
            body={noData.body}
         />
      );
   }

   const handleConfirmCancel = async () => {
      const res = await mutateCancel();

      if (res?.success) {
         toast.success(cancelModal.successToast);
         setOpenCancelModal(false);
         void refetch();
         await refetchUser();
      }
   };

   return (
      <div className="space-y-6">
         {/* Reusable Payment Recovery Banner */}
         <PaymentRecoveryBanner />

         {/* Top Overview Grid */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
               <SubscriptionPlanCard
                  plan={data.plan}
                  onUpgrade={() => setUpgradeModal(true)}
                  onCancel={() => setOpenCancelModal(true)}
               />
            </div>
            <div>
               <CreditWalletCard
                  credit={data.credit}
                  periodStart={data.plan.currentPeriodStart}
               />
            </div>
         </div>

         {/* Cancellation Confirmation Dialog */}
         <ConfirmDialog
            open={openCancelModal}
            onClose={() => setOpenCancelModal(false)}
            onConfirm={() => void handleConfirmCancel()}
            title={cancelModal.title}
            description={cancelModal.description}
            isLoading={isCancelPending}
            confirmText={cancelModal.confirmButton}
            variant="destructive"
         />
      </div>
   );
};

export default BillingView;
