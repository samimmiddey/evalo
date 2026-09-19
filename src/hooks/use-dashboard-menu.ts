import { intervieweeNavigationData, interviewerNavigationData } from "@/data/navigation/dashboard.navigation.data";
import { useAppUser } from "@/hooks/use-app-user";

export const useDashboardMenu = () => {
   const { user } = useAppUser();

   if (user?.role === 'INTERVIEWEE') {
      return intervieweeNavigationData;
   }

   if (user?.role === 'INTERVIEWER') {
      return interviewerNavigationData;
   }

   return [];
};