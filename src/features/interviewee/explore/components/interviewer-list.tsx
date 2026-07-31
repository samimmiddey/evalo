import { ViewType } from '@/types/ui.types';
import InterviwerCard from './interviewer-card';
import { useFetch } from '@/hooks/use-fetch';
import { getInterviewers } from '../../services/client/interviewee.service';
import InterviewerCardSkeleton from './skeletons/interviewer-card-skeleton';
import ErrorCard from '@/components/common/error-card';
import NoDataCard from '@/components/common/no-data-card';

interface InterviewerListProps {
   view: ViewType;
}

const InterviewerList = ({ view }: InterviewerListProps) => {
   const { isLoading, data, error } = useFetch(() => getInterviewers());

   // Loading state
   if (isLoading) {
      return (
         <div className={`grid gap-5 2xl:gap-6 ${view === 'list' ? 'md:grid-cols-1' : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'}`}>
            {
               Array.from({ length: 6 }).map((_, i) => (
                  <InterviewerCardSkeleton key={i} />
               ))
            }
         </div>
      );
   }

   // Error state
   if (error) {
      return <ErrorCard text={error} />;
   }

   // No data state
   if (!data?.data || data.data.length === 0) {
      return <NoDataCard text="No interviewers found." />;
   }

   return (
      <div className={`grid gap-5 2xl:gap-6 ${view === 'list' ? 'md:grid-cols-1' : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'}`}>
         {
            data.data?.map((interviewer) => (
               <InterviwerCard
                  key={interviewer.id}
                  interviewer={interviewer}
               />
            ))
         }
      </div>
   );
};

export default InterviewerList;