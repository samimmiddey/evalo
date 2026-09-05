import CardLayout from "@/components/layouts/card-layout";
import SecondaryTitle from "@/components/common/secondary-title";
import PrimaryBody from "@/components/common/primary-body";
import { LucideIcon } from "lucide-react";

export interface DashboardStatItem {
   label: string;
   value: string | number;
   suffix?: string;
   icon: LucideIcon;
   accent: string;
   subtext: string;
}

interface DashboardStatsProps {
   items: DashboardStatItem[];
}

export const DashboardStats = ({ items }: DashboardStatsProps) => {
   return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 2xl:gap-5">
         {items.map((item) => {
            const Icon = item.icon;
            return (
               <CardLayout
                  key={item.label}
                  className="p-5! space-y-3"
               >
                  <div className="flex items-center justify-between">
                     <PrimaryBody
                        text={item.label}
                        className="text-xs! lg:text-xs! 2xl:text-xs! font-semibold! uppercase tracking-wider text-zinc-400!"
                     />
                     <div className={`p-2 rounded-lg border ${item.accent}`}>
                        <Icon className="size-4" />
                     </div>
                  </div>

                  <SecondaryTitle
                     text={`${item.value}${item.suffix ?? ""}`}
                     className="text-2xl! lg:text-3xl! font-bold! text-zinc-100! tracking-tight!"
                  />

                  <PrimaryBody
                     text={item.subtext}
                     className="text-[11px]! lg:text-[11px]! 2xl:text-[11px]! text-zinc-500! font-medium! truncate"
                  />
               </CardLayout>
            );
         })}
      </div>
   );
};

export default DashboardStats;
