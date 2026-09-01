import EnhancedNoDataCard from '@/components/common/enhanced-no-data-card';
import ErrorCard from '@/components/common/error-card';
import { useInfiniteFetch } from '@/hooks/use-infinite-fetch';
import { usePaginationTrigger } from '@/hooks/use-pagination-trigger';
import { getAppointments } from '../services/appointments.client.service';
import { AppointmentsFilterParams, Feedback } from '../types/appointments.types';
import useDebounce from '@/hooks/use-debounce';
import ListEndMessage from '@/components/common/list-end-message';
import AppointmentCard from './appointment-card';
import InterviewCardSkeleton from './skeletons/interview-card-skeleton';
import { ViewType } from '@/types/ui.types';

interface AppointmentsListProps {
   filterParams: AppointmentsFilterParams;
   view: ViewType;
   onViewFeedback?: (feedbackId: string, feedback: Feedback) => void;
}

const AppointmentsList = ({ filterParams, view, onViewFeedback }: AppointmentsListProps) => {
   const debouncedParams = useDebounce(filterParams, 500);

   const params = {
      page: 1,
      pageSize: 10,
      search: debouncedParams.search,
      status: debouncedParams.status
   };

   const { isLoading, data, error, fetchNextPage, hasNextPage, isFetchingNextPage, refetch: refetchInterviewList } = useInfiniteFetch(
      (page) => getAppointments({ ...params, page }),
      [debouncedParams]
   );

   const { ref: sentinelRef } = usePaginationTrigger({
      onIntersect: fetchNextPage,
      enabled: hasNextPage,
      isFetching: isFetchingNextPage
   });

   // Loading state
   if (isLoading) {
      return (
         <SkeletonLoader view={view} />
      );
   }

   // Error state
   if (error) {
      return <ErrorCard text={error} />;
   }

   // No data state
   if (!data || data?.length === 0) {
      return (
         <EnhancedNoDataCard
            title="No appointments found"
            body="We couldn't find any appointments matching your filters. Book a time slot with our vetted professionals to start practicing."
            showButton={true}
            buttonText="Explore Interviewers"
            buttonLink="/dashboard/interviewers"
         />
      );
   }

   return (
      <div>
         <div className={`grid gap-5 2xl:gap-6 relative z-10 ${view === 'grid' ? 'grid-cols-1 xl:grid-cols-2' : 'grid-cols-1'}`}>
            {
               data.map((appointment) => (
                  <AppointmentCard
                     key={appointment.id}
                     appointment={appointment}
                     view={view}
                     onViewFeedback={onViewFeedback}
                     refetchInterviewList={refetchInterviewList}
                  />
               ))
            }
         </div>

         {/* Loading more state */}
         <div className='mt-5 2xl:mt-6'>
            {isFetchingNextPage && <SkeletonLoader view={view} />}
         </div>

         {/* Empty state */}
         {!hasNextPage && data?.length > 0 && (
            <div className='mt-8 2xl:mt-10'>
               <ListEndMessage text="You've reached the end of the list" />
            </div>
         )}

         {/* Pagination trigger */}
         <div ref={sentinelRef} className="h-6" />
      </div>
   );
};

const SkeletonLoader = ({ view }: { view: ViewType; }) => (
   <div className={`grid gap-5 2xl:gap-6 ${view === 'list' ? 'grid-cols-1' : 'grid-cols-1 xl:grid-cols-2'}`}>
      {
         Array.from({ length: 6 }).map((_, i) => (
            <InterviewCardSkeleton key={i} view={view} />
         ))
      }
   </div>
);

export default AppointmentsList;