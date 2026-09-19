"use client";

import { useAppUser } from "@/hooks/use-app-user";
import IntervieweeOverview from "./interviewee-overview";
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

   return <IntervieweeOverview />;
};

export default Dashboard;
