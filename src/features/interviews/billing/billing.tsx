"use client";

import HeaderLayout from "@/components/layouts/header-layout";
import PageHeaderLayout from "@/components/layouts/page-header-layout";
import PrimaryTitle from "@/components/common/primary-title";
import PrimaryBody from "@/components/common/primary-body";
import BillingView from "./components/billing-view";
import { billingData } from "@/data/billing/billing.data";
import BillingTabs from "./components/billing-tabs";

export const Billing = () => {
   return (
      <div className="container s-margin">
         <PageHeaderLayout>
            <HeaderLayout className="gap-4! items-start text-start mb-0! mx-0!">
               <PrimaryTitle text={billingData.header.title} className="tracking-tight" />
               <PrimaryBody
                  text={billingData.header.description}
                  className="max-w-2xl text-zinc-400 text-sm md:text-base leading-relaxed"
               />
            </HeaderLayout>
         </PageHeaderLayout>

         <BillingView />
         <BillingTabs />
      </div>
   );
};

export default Billing;
