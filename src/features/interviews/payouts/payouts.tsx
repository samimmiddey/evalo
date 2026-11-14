"use client";

import HeaderLayout from "@/components/layouts/header-layout";
import PageHeaderLayout from "@/components/layouts/page-header-layout";
import PrimaryTitle from "@/components/common/primary-title";
import PrimaryBody from "@/components/common/primary-body";
import { payoutsData } from "@/data/payouts/payouts.data";
import PayoutsView from "./components/payouts-view";
import PayoutTabs from "./components/payout-tabs";
import { useState } from "react";

export interface RefetchFunctions {
   refetchPayout?: () => void;
   refetchTransaction?: () => void;
}

const Payouts = () => {
   const [refetchFn, setRefetchFn] = useState<RefetchFunctions>({});

   return (
      <div className="container s-margin">
         <PageHeaderLayout>
            <HeaderLayout className="gap-4! items-start text-start mb-0! mx-0!">
               <PrimaryTitle text={payoutsData.header.title} className="tracking-tight" />
               <PrimaryBody
                  text={payoutsData.header.description}
                  className="max-w-2xl text-zinc-400 text-sm md:text-base leading-relaxed"
               />
            </HeaderLayout>
         </PageHeaderLayout>

         <PayoutsView
            onRefreshStats={() => {
               refetchFn.refetchPayout?.();
               refetchFn.refetchTransaction?.();
            }}
         />
         <PayoutTabs setRefetchFn={setRefetchFn} />
      </div>
   );
};

export default Payouts;
