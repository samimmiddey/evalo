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
import CreditTransactionsTab from "./credit-transactions-tab";
import InvoicesHistoryTab from "./invoices-history-tab";
import BillingSkeleton from "./skeletons/billing-skeleton";
import PaymentRecoveryBanner from "@/features/interviews/shared/components/payment-recovery-banner";
import ErrorCard from "@/components/common/error-card";
import EnhancedNoDataCard from "@/components/common/enhanced-no-data-card";
import ConfirmDialog from "@/components/common/confirm-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { History, Layers } from "lucide-react";
import { toast } from "sonner";
import { billingData } from "@/data/billing/billing.data";

export const BillingView = () => {
   const { cancelModal, noData, transactionsTab, invoicesTab } = billingData;
   const [activeTab, setActiveTab] = useState<"transactions" | "invoices">("transactions");
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
                  transactions={data.transactions}
                  periodStart={data.plan.currentPeriodStart}
               />
            </div>
         </div>

         {/* Sub Tabs: Credit Transactions vs Invoices */}
         <Tabs
            value={activeTab}
            onValueChange={(val) => setActiveTab(val as "transactions" | "invoices")}
            className="space-y-4"
         >
            <TabsList className="bg-zinc-900 border border-white/10 h-10! group-data-horizontal/tabs:h-10! p-1 gap-1.5 rounded-lg w-fit">
               <TabsTrigger
                  value="transactions"
                  className="h-full! py-2! px-3! gap-2 rounded-md data-active:bg-violet-500/15! data-active:text-violet-300! data-active:border-violet-500/30! data-active:border! text-zinc-400! hover:text-zinc-200! text-xs! font-semibold! transition-all! cursor-pointer!"
               >
                  <Layers className="w-3.5 h-3.5" />
                  <span>
                     {transactionsTab.tabLabel} ({data.transactions.length})
                  </span>
               </TabsTrigger>

               <TabsTrigger
                  value="invoices"
                  className="h-full! py-2! px-3! gap-2 rounded-md data-active:bg-violet-500/15! data-active:text-violet-300! data-active:border-violet-500/30! data-active:border! text-zinc-400! hover:text-zinc-200! text-xs! font-semibold! transition-all! cursor-pointer!"
               >
                  <History className="w-3.5 h-3.5" />
                  <span>
                     {invoicesTab.tabLabel} ({data.payments.length})
                  </span>
               </TabsTrigger>
            </TabsList>

            <TabsContent value="transactions">
               <CreditTransactionsTab transactions={data.transactions} />
            </TabsContent>

            <TabsContent value="invoices">
               <InvoicesHistoryTab payments={data.payments} />
            </TabsContent>
         </Tabs>

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
