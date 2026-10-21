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
import { Button } from "@/components/ui/button";
import { DashboardStats, DashboardStatItem } from "./components/dashboard-stats";
import { DashboardSessionCard } from "./components/dashboard-session-card";
import { DashboardQuickActions } from "./components/dashboard-quick-actions";
import { dashboardData } from "@/data/dashboard/dashboard.data";
import DashboardOverviewSkeleton from "./components/skeletons/dashboard-overview-skeleton";
import { Calendar, CheckCircle2, Compass, Flame, Video } from "lucide-react";
import Link from "next/link";
import ErrorCard from "@/components/common/error-card";
import PaymentRecoveryBanner from "@/features/interviews/shared/components/payment-recovery-banner";

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
   const { header, stats: statsConfig, sessionCard, quickActions } = dashboardData.candidate;

   const statItems: DashboardStatItem[] = [
      {
         label: statsConfig.total.label,
         value: stats?.totalCount ?? 0,
         icon: Video,
         accent: "text-violet-400 bg-violet-500/15 border-violet-500/30",
         subtext: statsConfig.total.subtext
      },
      {
         label: statsConfig.scheduled.label,
         value: stats?.scheduledCount ?? 0,
         icon: Calendar,
         accent: "text-blue-400 bg-blue-500/15 border-blue-500/30",
         subtext: statsConfig.scheduled.subtext
      },
      {
         label: statsConfig.completed.label,
         value: stats?.completedCount ?? 0,
         icon: CheckCircle2,
         accent: "text-emerald-400 bg-emerald-500/15 border-emerald-500/30",
         subtext: statsConfig.completed.subtext
      },
      {
         label: statsConfig.successRate.label,
         value: stats?.successRate ?? 0,
         suffix: "%",
         icon: Flame,
         accent: "text-amber-400 bg-amber-500/15 border-amber-500/30",
         subtext: statsConfig.successRate.subtext
      }
   ];

   return (
      <div className="container s-margin space-y-6 2xl:space-y-7">
         {/* Hero Header */}
         <PageHeaderLayout>
            <HeaderLayout className="gap-4! items-start text-start mb-0! mx-0!">
               <PrimaryTitle text={`Welcome back, ${firstName}!`} className="tracking-tight" />
               <PrimaryBody
                  text={header.description}
                  className="max-w-2xl text-zinc-400 text-sm md:text-base leading-relaxed"
               />
            </HeaderLayout>

            {/* Quick Action Button */}
            <div className="flex items-center gap-3">
               <Link href={header.actionButton.href} className="max-sm:w-full">
                  <Button className="cursor-pointer bg-violet-600 hover:bg-violet-700 text-zinc-100 text-xs rounded-lg h-9 px-4.5 font-semibold flex items-center gap-1.5 max-sm:w-full">
                     <Compass className="w-3.5 h-3.5" />
                     <span>{header.actionButton.label}</span>
                  </Button>
               </Link>
            </div>
         </PageHeaderLayout>

         {/* Reusable Payment Recovery Banner */}
         <PaymentRecoveryBanner />

         {/* 4 KPI Stats Cards */}
         <DashboardStats items={statItems} />

         {/* 2-Column Content Layout */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 2xl:gap-7 items-start">
            {/* Left Column: Next Up Session Card & Guidance */}
            <div className="lg:col-span-2 space-y-6">
               <DashboardSessionCard
                  title={sessionCard.title}
                  session={nextSession}
                  viewAllHref={sessionCard.viewAllHref}
                  viewAllLabel={sessionCard.viewAllLabel}
                  manageLabel={sessionCard.manageLabel}
                  emptyTitle={sessionCard.emptyTitle}
                  emptyDescription={sessionCard.emptyDescription}
               />
            </div>

            {/* Right Column: Wallet & Quick Actions */}
            <div>
               <DashboardQuickActions actions={quickActions} />
            </div>
         </div>
      </div>
   );
};

export default CandidateOverview;
