"use client";

import { useDbUser } from "@/hooks/use-db-user";
import IntervieweeOverview from "./interviewee-overview";
import InterviewerOverview from "./interviewer-overview";
import DashboardOverviewSkeleton from "./components/skeletons/dashboard-overview-skeleton";

export const Dashboard = () => {
   const { user, isLoading } = useDbUser();

   if (isLoading) {
      return <DashboardOverviewSkeleton />;
   }

   if (user?.role === "INTERVIEWER") {
      return <InterviewerOverview />;
   }

   return <IntervieweeOverview />;
};

export default Dashboard;
