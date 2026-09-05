"use client";

import { useFetch } from "@/hooks/use-fetch";
import { useDbUser } from "@/hooks/use-db-user";
import { getDashboardStats } from "@/features/interviews/interviewer-dashboard/services/dashboard.client.service";
import { DashboardStats as DashboardStatsType } from "@/features/interviews/interviewer-dashboard/types/dashboard.types";
import PageHeaderLayout from "@/components/layouts/page-header-layout";
import HeaderLayout from "@/components/layouts/header-layout";
import PrimaryTitle from "@/components/common/primary-title";
import PrimaryBody from "@/components/common/primary-body";
import { Button } from "@/components/ui/button";
import { DashboardStats, DashboardStatItem } from "./components/dashboard-stats";
import { DashboardSessionCard } from "./components/dashboard-session-card";
import { DashboardQuickActions } from "./components/dashboard-quick-actions";
import { dashboardData } from "@/data/dashboard/dashboard.data";
import DashboardOverviewSkeleton from "./components/skeletons/dashboard-overview-skeleton";
import { Calendar, Clock, Coins, Star, Video } from "lucide-react";
import Link from "next/link";

export const InterviewerOverview = () => {
   const { user } = useDbUser();
   const { isLoading: isStatsLoading, data: stats } = useFetch<DashboardStatsType>(() => getDashboardStats());

   if (isStatsLoading) {
      return <DashboardOverviewSkeleton />;
   }

   const firstName = user?.firstName ?? "there";
   const nextSession = stats?.nextSession;

   const statItems: DashboardStatItem[] = [
      {
         label: "Total Sessions",
         value: stats?.totalSessions ?? 0,
         icon: Video,
         accent: "text-violet-400 bg-violet-500/10 border-violet-500/20",
         subtext: `${stats?.completedSessions ?? 0} completed rounds`
      },
      {
         label: "Upcoming",
         value: stats?.scheduledSessions ?? 0,
         icon: Calendar,
         accent: "text-blue-400 bg-blue-500/10 border-blue-500/20",
         subtext: "On calendar schedule"
      },
      {
         label: "Credit Balance",
         value: stats?.creditBalance ?? 0,
         icon: Coins,
         accent: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
         subtext: `≈ $${(stats?.creditBalance ?? 0) * (stats?.creditRate ?? 25)} USD value`
      },
      {
         label: "Rating",
         value: stats?.averageRating ? stats.averageRating.toFixed(1) : "N/A",
         icon: Star,
         accent: "text-amber-400 bg-amber-500/10 border-amber-500/20",
         subtext: `${stats?.totalRatings ?? 0} total candidate reviews`
      }
   ];

   const sessionData = nextSession ? {
      startTime: nextSession.startTime,
      streamCallId: nextSession.streamCallId,
      counterpart: {
         name: `${nextSession.candidate?.firstName} ${nextSession.candidate?.lastName}`,
         imageUrl: nextSession.candidate?.imageUrl,
         fallbackInitial: nextSession.candidate?.firstName?.[0] ?? "C",
         subtitle: `Candidate • ${nextSession.creditsCharged} Credits Booked`
      }
   } : null;

   return (
      <div className="container s-margin space-y-7 2xl:space-y-8">
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
                  <Button className="cursor-pointer bg-violet-600 hover:bg-violet-700 text-zinc-100 text-xs rounded-lg h-9 px-4.5 font-semibold shadow-lg hover:shadow-violet-600/10 flex items-center gap-1.5 max-sm:w-full">
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
                  session={sessionData}
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
