import { intervieweeNavigationData, interviewerNavigationData } from "@/data/navigation/dashboard.navigation.data";
import { useDbUser } from "@/hooks/use-db-user";

export const useDashboardMenu = () => {
   const { user } = useDbUser();

   if (user?.role === 'INTERVIEWEE') {
      return intervieweeNavigationData;
   }

   if (user?.role === 'INTERVIEWER') {
      return interviewerNavigationData;
   }

   return [];
};