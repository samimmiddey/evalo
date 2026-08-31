import PrimaryBody from "@/components/common/primary-body";
import PrimaryTitle from "@/components/common/primary-title";
import SecondaryTitle from "@/components/common/secondary-title";
import HeaderLayout from "@/components/layouts/header-layout";
import PageHeaderLayout from "@/components/layouts/page-header-layout";
import { DashboardStats } from "../types/dashboard.types";
import { dashboardData } from "@/data/dashboard/dashboard.data";
import { Calendar, Coins, Star, Video } from "lucide-react";
import { DashboardHeaderSkeleton } from "./skeletons/dashboard-header-skeleton";

interface DashboardHeaderProps {
   data: DashboardStats | null;
   isLoading: boolean;
}

export const DashboardHeader = ({ data, isLoading }: DashboardHeaderProps) => {
   if (isLoading) {
      return <DashboardHeaderSkeleton />;
   }

   return (
      <PageHeaderLayout>
         <HeaderLayout className="gap-4! items-start text-start mb-0! mx-0!">
            <PrimaryTitle text={dashboardData.header.title} className="tracking-tight" />
            <PrimaryBody
               text={dashboardData.header.description}
               className="max-w-2xl text-zinc-400 text-sm md:text-base leading-relaxed"
            />
         </HeaderLayout>

         {/* Mini Stats Metrics */}
         <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full md:w-auto shrink-0">
            {/* Total Sessions */}
            <div className="bg-zinc-900/40 border border-white/5 rounded-xl p-3 text-center min-w-26">
               <div className="flex items-center justify-center gap-1 text-zinc-500 mb-1">
                  <Video className="w-3.5 h-3.5" />
                  <PrimaryBody text="Total" className="text-[10px]! lg:text-[10px]! 2xl:text-[10px]! uppercase tracking-wider font-semibold!" />
               </div>
               <SecondaryTitle text={`${data?.totalSessions ?? 0}`} className="text-lg! font-bold! text-zinc-100!" />
            </div>

            {/* Scheduled Upcoming */}
            <div className="bg-zinc-900/40 border border-white/5 rounded-xl p-3 text-center min-w-26">
               <div className="flex items-center justify-center gap-1 text-blue-400/80 mb-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <PrimaryBody text="Upcoming" className="text-[10px]! lg:text-[10px]! 2xl:text-[10px]! uppercase tracking-wider font-semibold!" />
               </div>
               <SecondaryTitle text={`${data?.scheduledSessions ?? 0}`} className="text-lg! font-bold! text-blue-400!" />
            </div>

            {/* Balance Credits */}
            <div className="bg-zinc-900/40 border border-white/5 rounded-xl p-3 text-center min-w-26">
               <div className="flex items-center justify-center gap-1 text-violet-400/80 mb-1">
                  <Coins className="w-3.5 h-3.5" />
                  <PrimaryBody text="Balance" className="text-[10px]! lg:text-[10px]! 2xl:text-[10px]! uppercase tracking-wider font-semibold!" />
               </div>
               <SecondaryTitle text={`${data?.creditBalance ?? 0}`} className="text-lg! font-bold! text-violet-400!" />
            </div>

            {/* Rating */}
            <div className="bg-zinc-900/40 border border-white/5 rounded-xl p-3 text-center min-w-26">
               <div className="flex items-center justify-center gap-1 text-amber-400/80 mb-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400/20" />
                  <PrimaryBody text="Rating" className="text-[10px]! lg:text-[10px]! 2xl:text-[10px]! uppercase tracking-wider font-semibold!" />
               </div>
               <SecondaryTitle
                  text={`${data?.averageRating ? data.averageRating.toFixed(1) : "N/A"} (${data?.totalRatings ?? 0})`}
                  className="text-lg! font-bold! text-amber-400!"
               />
            </div>
         </div>
      </PageHeaderLayout>
   );
};

export default DashboardHeader;
