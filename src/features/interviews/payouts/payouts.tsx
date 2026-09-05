"use client";

import HeaderLayout from "@/components/layouts/header-layout";
import PageHeaderLayout from "@/components/layouts/page-header-layout";
import PrimaryTitle from "@/components/common/primary-title";
import PrimaryBody from "@/components/common/primary-body";
import { interviewerData } from "@/data/interviews/interviews.data";
import PayoutsView from "./components/payouts-view";

const Payouts = () => {
   return (
      <div className="container s-margin">
         <PageHeaderLayout>
            <HeaderLayout className="gap-4! items-start text-start mb-0! mx-0!">
               <PrimaryTitle text={interviewerData.payouts.title} className="tracking-tight" />
               <PrimaryBody
                  text={interviewerData.payouts.description}
                  className="max-w-2xl text-zinc-400 text-sm md:text-base leading-relaxed"
               />
            </HeaderLayout>
         </PageHeaderLayout>

         <PayoutsView />
      </div>
   );
};

export default Payouts;
