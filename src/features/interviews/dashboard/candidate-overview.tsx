"use client";

import { useFetch } from "@/hooks/use-fetch";
import { useAppUser } from "@/hooks/use-app-user";
import { getAppointmentsStats } from "@/features/interviews/appointments/services/appointments.client.service";
import { AppointmentsStatsData } from "@/features/interviews/appointments/types/appointments.types";
import { getNextSession } from "./services/dashboard.client.service";
import { DashboardNextSession } from "./types/dashboard.types";
import PageHeaderLayout from "@/components/layouts/page-header-layout";
import HeaderLayout from "@/components/layouts/header-layout";
import PrimaryTitle from "@/components/common/primary-title";
import PrimaryBody from "@/components/common/primary-body";
import SecondaryTitle from "@/components/common/secondary-title";
import { Button } from "@/components/ui/button";
import { DashboardStats, DashboardStatItem } from "./components/dashboard-stats";
import { DashboardSessionCard } from "./components/dashboard-session-card";
import { DashboardQuickActions } from "./components/dashboard-quick-actions";
import { dashboardData } from "@/data/interviews/interviews.data";
import DashboardOverviewSkeleton from "./components/skeletons/dashboard-overview-skeleton";
import { AlertTriangle, Calendar, CheckCircle2, Compass, Flame, Video } from "lucide-react";
import Link from "next/link";
import ErrorCard from "@/components/common/error-card";
import { PRO, STARTER } from "@/constants/cashfree";

export const CandidateOverview = () => {
   const { user } = useAppUser();
   const { isLoading: isStatsLoading, data: stats, error: statsError } = useFetch<AppointmentsStatsData>(() => getAppointmentsStats());
   const { isLoading: isSessionLoading, data: nextSession, error: nextSessionError } = useFetch<DashboardNextSession | null>(() => getNextSession());

   // Loading State
   if (isStatsLoading || isSessionLoading) {
      return <DashboardOverviewSkeleton />;
   }

   // Error State
   if (statsError || nextSessionError) {
      return (
         <div className="container s-margin">
            <ErrorCard text={statsError ?? nextSessionError ?? ''} />
         </div>
      );
   }

   const firstName = user?.firstName ?? "there";

   const statItems: DashboardStatItem[] = [
      {
         label: "Total Interviews",
         value: stats?.totalCount ?? 0,
         icon: Video,
         accent: "text-violet-400 bg-violet-500/15 border-violet-500/30",
         subtext: "All booked sessions"
      },
      {
         label: "Upcoming",
         value: stats?.scheduledCount ?? 0,
         icon: Calendar,
         accent: "text-blue-400 bg-blue-500/15 border-blue-500/30",
         subtext: "Scheduled on calendar"
      },
      {
         label: "Completed",
         value: stats?.completedCount ?? 0,
         icon: CheckCircle2,
         accent: "text-emerald-400 bg-emerald-500/15 border-emerald-500/30",
         subtext: "With AI feedback"
      },
      {
         label: "Success Rate",
         value: stats?.successRate ?? 0,
         suffix: "%",
         icon: Flame,
         accent: "text-amber-400 bg-amber-500/15 border-amber-500/30",
         subtext: "Completion benchmark"
      }
   ];

   const checkoutPlanId = user?.currentPlan?.toLowerCase() === 'pro' ? PRO : STARTER;

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
                  <Button className="cursor-pointer bg-violet-600 hover:bg-violet-700 text-zinc-100 text-xs rounded-lg h-9 px-4.5 font-semibold flex items-center gap-1.5 max-sm:w-full">
                     <Compass className="w-3.5 h-3.5" />
                     <span>Explore Interviewers</span>
                  </Button>
               </Link>
            </div>
         </PageHeaderLayout>

         {/* ON_HOLD payment fix banner */}
         {
            user?.subscriptionStatus === 'ON_HOLD' && (
               <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-amber-500/20 bg-amber-500/10 p-5 sm:p-4">
                  <div className="flex items-center max-sm:flex-col max-sm:text-center gap-3">
                     <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
                        <AlertTriangle className="h-5 w-5" />
                     </div>
                     <div>
                        <SecondaryTitle
                           text="Subscription payment on hold"
                           className="text-[15px]! font-medium text-amber-200 mb-1"
                        />
                        <PrimaryBody
                           text="Your latest renewal payment failed. Complete payment to keep your interview credits and plan active."
                           className="text-xs lg:text-xs 2xl:text-[13px] text-amber-100/90"
                        />
                     </div>
                  </div>
                  <div className="shrink-0 max-sm:w-full flex justify-end">
                     <Link
                        href={`/checkout/${checkoutPlanId}`}
                        className="relative inline-flex h-9 overflow-hidden rounded-lg p-0.5 focus:outline-none max-sm:w-full"
                     >
                        {/* Flowing border colors: seamless loop, no hard edge */}
                        <span className="absolute inset-[-1000%] animate-[spin_4s_linear_infinite_reverse] bg-[conic-gradient(from_0deg,#fde047,#ea580c,#fde047,#ea580c,#fde047)]" />

                        {/* Static gradient body (no animation) */}
                        <span className="relative inline-flex h-full w-full items-center justify-center rounded-md bg-linear-to-r from-yellow-400 to-orange-500 px-4 text-sm font-semibold text-zinc-950 transition-opacity hover:opacity-90">
                           Fix Payment
                        </span>
                     </Link>
                  </div>
               </div>
            )
         }

         {/* 4 KPI Stats Cards */}
         <DashboardStats items={statItems} />

         {/* 2-Column Content Layout */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 2xl:gap-7 items-start">
            {/* Left Column: Next Up Session Card & Guidance */}
            <div className="lg:col-span-2 space-y-6">
               <DashboardSessionCard
                  title="Upcoming Interviews"
                  session={nextSession}
                  viewAllHref="/dashboard/appointments"
                  viewAllLabel="View all appointments"
                  manageLabel="Manage Booking"
                  emptyTitle="No Upcoming Interviews"
                  emptyDescription="Ready to practice? Connect with engineering leaders for mock coding and system design rounds."
               />
            </div>

            {/* Right Column: Wallet & Quick Actions */}
            <div>
               <DashboardQuickActions actions={dashboardData.candidate.quickActions} />
            </div>
         </div>
      </div>
   );
};

export default CandidateOverview;
