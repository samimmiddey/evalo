"use client";

import { useAppUser } from "@/hooks/use-app-user";
import CandidateOverview from "./candidate-overview";
import InterviewerOverview from "./interviewer-overview";
import DashboardOverviewSkeleton from "./components/skeletons/dashboard-overview-skeleton";

export const Dashboard = () => {
   const { user, isLoading } = useAppUser();

   if (isLoading || !user) {
      return <DashboardOverviewSkeleton />;
   }

   if (user?.role === "INTERVIEWER") {
      return <InterviewerOverview />;
   }

   return <CandidateOverview />;
};

export default Dashboard;
