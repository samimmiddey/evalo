"use client";

import { useFetch } from "@/hooks/use-fetch";
import { useDbUser } from "@/hooks/use-db-user";
import { getAppointments, getAppointmentsStats } from "@/features/interviews/appointments/services/appointments.client.service";
import { AppointmentsData, AppointmentsStatsData } from "@/features/interviews/appointments/types/appointments.types";
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
import { Calendar, CheckCircle2, Compass, Flame, Video } from "lucide-react";
import Link from "next/link";

export const IntervieweeOverview = () => {
   const { user } = useDbUser();
   const { isLoading: isStatsLoading, data: stats } = useFetch<AppointmentsStatsData>(() => getAppointmentsStats());
   const { isLoading: isAppointmentsLoading, data: appointmentsData } = useFetch<AppointmentsData>(() =>
      getAppointments({ page: 1, pageSize: 1, status: "SCHEDULED" })
   );

   if (isStatsLoading || isAppointmentsLoading) {
      return <DashboardOverviewSkeleton />;
   }

   const firstName = user?.firstName ?? "there";
   const nextSession = appointmentsData?.data?.[0];

   const statItems: DashboardStatItem[] = [
      {
         label: "Total Interviews",
         value: stats?.totalCount ?? 0,
         icon: Video,
         accent: "text-violet-400 bg-violet-500/10 border-violet-500/20",
         subtext: "All booked sessions"
      },
      {
         label: "Upcoming",
         value: stats?.scheduledCount ?? 0,
         icon: Calendar,
         accent: "text-blue-400 bg-blue-500/10 border-blue-500/20",
         subtext: "Scheduled on calendar"
      },
      {
         label: "Completed",
         value: stats?.completedCount ?? 0,
         icon: CheckCircle2,
         accent: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
         subtext: "With AI feedback"
      },
      {
         label: "Success Rate",
         value: stats?.successRate ?? 0,
         suffix: "%",
         icon: Flame,
         accent: "text-amber-400 bg-amber-500/10 border-amber-500/20",
         subtext: "Completion benchmark"
      }
   ];

   const sessionData = nextSession ? {
      startTime: nextSession.startTime,
      streamCallId: nextSession.streamCallId,
      counterpart: {
         name: `${nextSession.interviewer?.firstName} ${nextSession.interviewer?.lastName}`,
         imageUrl: nextSession.interviewer?.imageUrl,
         fallbackInitial: nextSession.interviewer?.firstName?.[0] ?? "I",
         subtitle: `${nextSession.interviewer?.designation} • ${nextSession.interviewer?.company}`
      }
   } : null;

   return (
      <div className="container s-margin space-y-6 2xl:space-y-7">
         {/* Hero Header */}
         <PageHeaderLayout>
            <HeaderLayout className="gap-4! items-start text-start mb-0! mx-0!">
               <PrimaryTitle text={`Welcome back, ${firstName}!`} className="tracking-tight" />
               <PrimaryBody
                  text="Track your mock interview metrics, upcoming sessions, and review structured feedback from verified engineers."
                  className="max-w-2xl text-zinc-400 text-sm md:text-base leading-relaxed"
               />
            </HeaderLayout>

            {/* Quick Action Button */}
            <div className="flex items-center gap-3">
               <Link href="/dashboard/interviewers" className="max-sm:w-full">
                  <Button className="cursor-pointer bg-violet-600 hover:bg-violet-700 text-zinc-100 text-xs rounded-lg h-9 px-4.5 font-semibold shadow-lg hover:shadow-violet-600/10 flex items-center gap-1.5 max-sm:w-full">
                     <Compass className="w-3.5 h-3.5" />
                     <span>Explore Interviewers</span>
                  </Button>
               </Link>
            </div>
         </PageHeaderLayout>

         {/* 4 KPI Stats Cards */}
         <DashboardStats items={statItems} />

         {/* 2-Column Content Layout */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 2xl:gap-7 items-start">
            {/* Left Column: Next Up Session Card & Guidance */}
            <div className="lg:col-span-2 space-y-6">
               <DashboardSessionCard
                  title="Upcoming Interviews"
                  session={sessionData}
                  viewAllHref="/dashboard/appointments"
                  viewAllLabel="View all appointments"
                  manageLabel="Manage Booking"
                  emptyTitle="No Upcoming Interviews"
                  emptyDescription="Ready to practice? Connect with engineering leaders for mock coding and system design rounds."
               />
            </div>

            {/* Right Column: Wallet & Quick Actions */}
            <div>
               <DashboardQuickActions actions={dashboardData.interviewee.quickActions} />
            </div>
         </div>
      </div>
   );
};

export default IntervieweeOverview;
