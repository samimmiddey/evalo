"use client";

import { interviewerDashboardData } from "@/data/interviewer-dashboard/interviewer-dashboard.data";
import { cn } from "@/lib/utils";
import { DashboardTabType } from "../types/dashboard.types";
import { Badge } from "@/components/ui/badge";

interface DashboardTabsProps {
   activeTab: DashboardTabType;
   onTabChange: (tab: DashboardTabType) => void;
   upcomingCount?: number;
}

export const DashboardTabs = ({
   activeTab,
   onTabChange,
   upcomingCount = 0
}: DashboardTabsProps) => {
   return (
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-2 bg-zinc-900/40 border border-white/5 rounded-xl mb-7 2xl:mb-8 relative z-10 backdrop-blur-xl">
         <div className="grid md:grid-cols-4 grid-cols-2 gap-2 w-full">
            {interviewerDashboardData.tabs.map((tab) => {
               const isActive = activeTab === tab.id;
               const Icon = tab.icon;

               return (
                  <Badge
                     key={tab.id}
                     onClick={() => onTabChange(tab.id)}
                     className={cn(
                        "relative justify-center w-full flex items-center gap-2 px-4! h-10 text-sm font-medium rounded-lg! transition-all duration-200 cursor-pointer",
                        isActive ? 'bg-violet-500/10 border-violet-500/30 hover:bg-violet-500/20 text-violet-300' : 'bg-zinc-900 border-white/10 text-zinc-400 hover:text-zinc-100 hover:border-white/20'
                     )}
                  >
                     <span className="relative z-10 flex items-center gap-2">
                        <Icon className={cn("w-4 h-4", isActive ? "text-violet-400" : "text-zinc-400")} />
                        <span>{tab.label}</span>
                        {tab.id === "sessions" && upcomingCount > 0 && (
                           <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-violet-500/30 text-violet-300 border border-violet-500/40">
                              {upcomingCount}
                           </span>
                        )}
                     </span>
                  </Badge>
               );
            })}
         </div>
      </div>
   );
};

export default DashboardTabs;
