"use client";

import { useFetch } from "@/hooks/use-fetch";
import { useAppUser } from "@/hooks/use-app-user";
import { getDashboardStats, getNextSession } from "./services/dashboard.client.service";
import { DashboardNextSession, DashboardStats as DashboardStatsType } from "./types/dashboard.types";
import PageHeaderLayout from "@/components/layouts/page-header-layout";
import HeaderLayout from "@/components/layouts/header-layout";
import PrimaryTitle from "@/components/common/primary-title";
import PrimaryBody from "@/components/common/primary-body";
import { Button } from "@/components/ui/button";
import { DashboardStats, DashboardStatItem } from "./components/dashboard-stats";
import { DashboardSessionCard } from "./components/dashboard-session-card";
import { DashboardQuickActions } from "./components/dashboard-quick-actions";
import { dashboardData } from "@/data/interviews/interviews.data";
import DashboardOverviewSkeleton from "./components/skeletons/dashboard-overview-skeleton";
import { Calendar, Clock, Coins, Star, Video } from "lucide-react";
import Link from "next/link";
import { usePlatformConfig } from "@/hooks/use-config";
import ErrorCard from "@/components/common/error-card";

export const InterviewerOverview = () => {
   const { user } = useAppUser();
   const { isLoading: isStatsLoading, data: stats, error: statsError } = useFetch<DashboardStatsType>(() => getDashboardStats());
   const { isLoading: isSessionLoading, data: nextSession, error: nextSessionError } = useFetch<DashboardNextSession | null>(() => getNextSession());

   const { config, isLoading: isConfigLoading, error: configError } = usePlatformConfig();

   // Loading State
   if (isStatsLoading || isSessionLoading || isConfigLoading) {
      return <DashboardOverviewSkeleton />;
   }

   // Error State
   if (statsError || nextSessionError || configError) {
      return (
         <div className="container s-margin">
            <ErrorCard text={statsError ?? nextSessionError ?? configError ?? ''} />
         </div>
      );
   }

   const firstName = user?.firstName ?? "there";

   const statItems: DashboardStatItem[] = [
      {
         label: "Total Sessions",
         value: stats?.totalSessions ?? 0,
         icon: Video,
         accent: "text-violet-400 bg-violet-500/15 border-violet-500/30",
         subtext: `${stats?.completedSessions ?? 0} completed rounds`
      },
      {
         label: "Upcoming",
         value: stats?.scheduledSessions ?? 0,
         icon: Calendar,
         accent: "text-blue-400 bg-blue-500/15 border-blue-500/30",
         subtext: "On calendar schedule"
      },
      {
         label: "Credit Balance",
         value: stats?.creditBalance ?? 0,
         icon: Coins,
         accent: "text-emerald-400 bg-emerald-500/15 border-emerald-500/30",
         subtext: config
            ? `$${(stats?.creditBalance ?? 0) * config.creditPayoutRate} ${config.currency} value`
            : "N/A"
      },
      {
         label: "Rating",
         value: stats?.averageRating ? stats.averageRating.toFixed(1) : "N/A",
         icon: Star,
         accent: "text-amber-400 bg-amber-500/15 border-amber-500/30",
         subtext: `${stats?.totalRatings ?? 0} total candidate reviews`
      }
   ];

   return (
      <div className="container s-margin space-y-6 2xl:space-y-7">
         {/* Hero Header */}
         <PageHeaderLayout>
            <HeaderLayout className="gap-4! items-start text-start mb-0! mx-0!">
               <PrimaryTitle text={`Welcome back, ${firstName}!`} className="tracking-tight" />
               <PrimaryBody
                  text="Monitor your mock interview schedule, manage slot bookings, and track credit earnings and candidate reviews."
                  className="max-w-2xl text-zinc-400 text-sm md:text-base leading-relaxed"
               />
            </HeaderLayout>

            {/* Quick Action Button */}
            <div className="flex items-center gap-3">
               <Link href="/dashboard/availability" className="max-sm:w-full">
                  <Button className="cursor-pointer bg-violet-600 hover:bg-violet-700 text-zinc-100 text-xs rounded-lg h-9 px-4.5 font-semibold flex items-center gap-1.5 max-sm:w-full">
                     <Clock className="w-3.5 h-3.5" />
                     <span>Configure Slots</span>
                  </Button>
               </Link>
            </div>
         </PageHeaderLayout>

         {/* 4 KPI Stats Cards */}
         <DashboardStats items={statItems} />

         {/* 2-Column Content Layout */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 2xl:gap-7 items-start">
            {/* Left Column: Next Up Session Card */}
            <div className="lg:col-span-2 space-y-6">
               <DashboardSessionCard
                  title="Upcoming Sessions"
                  session={nextSession}
                  viewAllHref="/dashboard/sessions"
                  viewAllLabel="View all sessions"
                  manageLabel="Manage Session"
                  emptyTitle="No Scheduled Sessions"
                  emptyDescription="Keep your calendar up to date by configuring availability slots for candidates to book."
               />
            </div>

            {/* Right Column: Wallet & Quick Actions */}
            <div>
               <DashboardQuickActions actions={dashboardData.interviewer.quickActions} />
            </div>
         </div>
      </div>
   );
};

export default InterviewerOverview;
