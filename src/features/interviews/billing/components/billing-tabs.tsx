import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { History, Layers } from 'lucide-react';
import { useState } from 'react';
import CreditTransactionsTab from './credit-transactions-tab';
import PaymentHistoryTab from './payment-history-tab';
import { billingData } from '@/data/billing/billing.data';

const BillingTabs = () => {
   const [activeTab, setActiveTab] = useState<"transactions" | "payments">("transactions");

   const { transactionsTab, paymentsTab } = billingData;

   return (
      <Tabs
         value={activeTab}
         onValueChange={(val) => setActiveTab(val as "transactions" | "payments")}
         className="space-y-4 mt-6"
      >
         <TabsList className="bg-zinc-900 border border-white/10 h-10! group-data-horizontal/tabs:h-10! p-1 gap-1.5 rounded-lg w-fit">
            <TabsTrigger
               value="transactions"
               className="h-full! py-2! px-3! gap-2 rounded-md data-active:bg-violet-500/15! data-active:text-violet-300! data-active:border-violet-500/30! data-active:border! text-zinc-400! hover:text-zinc-200! text-xs! font-semibold! transition-all! cursor-pointer!"
            >
               <Layers className="w-3.5 h-3.5" />
               <span>
                  {transactionsTab.tabLabel}
               </span>
            </TabsTrigger>

            <TabsTrigger
               value="payments"
               className="h-full! py-2! px-3! gap-2 rounded-md data-active:bg-violet-500/15! data-active:text-violet-300! data-active:border-violet-500/30! data-active:border! text-zinc-400! hover:text-zinc-200! text-xs! font-semibold! transition-all! cursor-pointer!"
            >
               <History className="w-3.5 h-3.5" />
               <span>
                  {paymentsTab.tabLabel}
               </span>
            </TabsTrigger>
         </TabsList>

         <TabsContent value="transactions">
            <CreditTransactionsTab />
         </TabsContent>

         <TabsContent value="payments">
            <PaymentHistoryTab />
         </TabsContent>
      </Tabs>
   );
};

export default BillingTabs;