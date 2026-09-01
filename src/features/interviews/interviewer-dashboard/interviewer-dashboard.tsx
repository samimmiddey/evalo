"use client";

import { useState, useEffect } from "react";
import { useFetch } from "@/hooks/use-fetch";
import { getDashboardStats } from "./services/dashboard.client.service";
import { DashboardStats, DashboardTabType } from "./types/dashboard.types";
import DashboardHeader from "./components/dashboard-header";
import DashboardTabs from "./components/dashboard-tabs";
import SessionsView from "./components/sessions/sessions-view";
import AvailabilityView from "./components/availability/availability-view";
import PayoutsView from "./components/payouts/payouts-view";
import ProfileSettingsForm from "./components/settings/profile-settings-form";
import { toast } from "sonner";

export const InterviewerDashboard = () => {
   const [activeTab, setActiveTab] = useState<DashboardTabType>("sessions");

   const {
      isLoading,
      data: stats,
      error,
      refetch: refetchStats
   } = useFetch<DashboardStats>(() => getDashboardStats());

   useEffect(() => {
      if (error) {
         toast.error(error);
      }
   }, [error]);

   return (
      <div className="container s-margin">
         {/* Top Header with KPI Metrics */}
         <DashboardHeader data={stats} isLoading={isLoading} />

         {/* Navigation Tab Bar */}
         <DashboardTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            upcomingCount={stats?.scheduledSessions ?? 0}
         />

         {/* Tab Content Panels */}
         <div>
            {activeTab === "sessions" && <SessionsView />}
            {activeTab === "availability" && <AvailabilityView />}
            {activeTab === "payouts" && (
               <PayoutsView
                  onRefreshStats={() => {
                     void refetchStats();
                  }}
               />
            )}
            {activeTab === "settings" && (
               <ProfileSettingsForm
                  onProfileUpdated={() => {
                     void refetchStats();
                  }}
               />
            )}
         </div>
      </div>
   );
};

export default InterviewerDashboard;
