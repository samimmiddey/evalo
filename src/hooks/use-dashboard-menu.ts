import { candidateNavigationData, interviewerNavigationData } from "@/data/navigation/dashboard.navigation.data";
import { useAppUser } from "@/hooks/use-app-user";

export const useDashboardMenu = () => {
   const { user } = useAppUser();

   if (user?.role === 'CANDIDATE') {
      return candidateNavigationData;
   }

   if (user?.role === 'INTERVIEWER') {
      return interviewerNavigationData;
   }

   return [];
};