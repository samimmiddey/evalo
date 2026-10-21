"use client";

import HeaderLayout from "@/components/layouts/header-layout";
import PageHeaderLayout from "@/components/layouts/page-header-layout";
import PrimaryTitle from "@/components/common/primary-title";
import PrimaryBody from "@/components/common/primary-body";
import { sessionsData } from "@/data/sessions/sessions.data";
import SessionsView from "./components/sessions-view";

const Sessions = () => {
   return (
      <div className="container s-margin">
         <PageHeaderLayout>
            <HeaderLayout className="gap-4! items-start text-start mb-0! mx-0!">
               <PrimaryTitle text={sessionsData.header.title} className="tracking-tight" />
               <PrimaryBody
                  text={sessionsData.header.description}
                  className="max-w-2xl text-zinc-400 text-sm md:text-base leading-relaxed"
               />
            </HeaderLayout>
         </PageHeaderLayout>

         <SessionsView />
      </div>
   );
};

export default Sessions;
