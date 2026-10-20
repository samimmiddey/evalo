"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { History, Layers } from 'lucide-react';
import PayoutHistoryList from './payout-history-list';
import TransactionsHistory from './transactions-history';
import { useState } from 'react';
import { payoutsData } from '@/data/payouts/payouts.data';

const PayoutTabs = () => {
   const [activeSubTab, setActiveSubTab] = useState<"payouts" | "transactions">("payouts");
   const { payoutsTab, transactionsTab } = payoutsData;

   return (
      <Tabs
         value={activeSubTab}
         onValueChange={(val) => setActiveSubTab(val as "payouts" | "transactions")}
         className="space-y-4 mt-6"
      >
         <TabsList className="bg-zinc-900 border border-white/10 h-10! group-data-horizontal/tabs:h-10! p-1 gap-1.5 rounded-lg w-fit">
            <TabsTrigger
               value="payouts"
               className="h-full! py-2! px-3! gap-2 rounded-md data-active:bg-violet-500/15! data-active:text-violet-300! data-active:border-violet-500/30! data-active:border! text-zinc-400! hover:text-zinc-200! text-xs! font-semibold! transition-all! cursor-pointer!"
            >
               <History className="w-3.5 h-3.5" />
               <span>{payoutsTab.tabLabel}</span>
            </TabsTrigger>

            <TabsTrigger
               value="transactions"
               className="h-full! py-2! px-3! gap-2 rounded-md data-active:bg-violet-500/15! data-active:text-violet-300! data-active:border-violet-500/30! data-active:border! text-zinc-400! hover:text-zinc-200! text-xs! font-semibold! transition-all! cursor-pointer!"
            >
               <Layers className="w-3.5 h-3.5" />
               <span>{transactionsTab.tabLabel}</span>
            </TabsTrigger>
         </TabsList>

         <TabsContent value="payouts">
            <PayoutHistoryList />
         </TabsContent>

         <TabsContent value="transactions">
            <TransactionsHistory />
         </TabsContent>
      </Tabs>
   );
};

export default PayoutTabs;