"use client";

import PrimaryBody from "@/components/common/primary-body";
import SecondaryTitle from "@/components/common/secondary-title";
import { ArrowUpRight, LucideIcon } from "lucide-react";
import Link from "next/link";

export interface DashboardQuickActionItem {
   title: string;
   description: string;
   href: string;
   icon: LucideIcon;
   accent?: string;
}

interface DashboardQuickActionsProps {
   actions: DashboardQuickActionItem[];
}

export const DashboardQuickActions = ({ actions }: DashboardQuickActionsProps) => {
   return (
      <div className="space-y-6">
         {/* Quick Action Navigation Links */}
         <div className="grid grid-cols-1 gap-3">
            {actions.map((action) => {
               const Icon = action.icon;
               return (
                  <Link
                     key={action.title}
                     href={action.href}
                     className="group block p-4 rounded-xl bg-zinc-900/40 border border-white/5 hover:border-white/15 transition-all duration-200"
                  >
                     <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                           <div className="p-2 rounded-lg bg-white/5 text-violet-400 group-hover:bg-violet-500/10 transition-colors shrink-0">
                              <Icon className="size-4" />
                           </div>
                           <div className="space-y-1">
                              <SecondaryTitle
                                 text={action.title}
                                 className="text-sm! font-semibold! text-zinc-200! group-hover:text-violet-300! transition-colors"
                              />
                              <PrimaryBody
                                 text={action.description}
                                 className="text-xs! lg:text-xs! 2xl:text-xs! text-zinc-400! leading-relaxed"
                              />
                           </div>
                        </div>
                        <ArrowUpRight className="size-4 text-zinc-500 group-hover:text-zinc-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 mt-0.5" />
                     </div>
                  </Link>
               );
            })}
         </div>
      </div>
   );
};

export default DashboardQuickActions;
