import { ViewType } from '@/types/ui.types';
import InterviwerCard from './interviewer-card';
import { useInfiniteFetch } from '@/hooks/use-infinite-fetch';
import { getInterviewers } from '../services/list.client.service';
import InterviewerCardSkeleton from './skeletons/interviewer-card-skeleton';
import ErrorCard from '@/components/common/error-card';
import NoDataCard from '@/components/common/no-data-card';
import { FilterParams } from '../types/list.type';
import useDebounce from '@/hooks/use-debounce';
import { usePaginationTrigger } from '@/hooks/use-pagination-trigger';
import ListEndMessage from '@/components/common/list-end-message';

interface InterviewerListProps {
   view: ViewType;
   filterParams: FilterParams;
}

const InterviewerList = ({ view, filterParams }: InterviewerListProps) => {
   const debouncedParams = useDebounce(filterParams, 500);

   const params = {
      page: 1,
      pageSize: 10,
      search: debouncedParams.search,
      expertise: debouncedParams.expertise,
      experience: debouncedParams.experience
   };

   // Get all interviewers with pagination and filters
   const { isLoading, data, error, isFetchingNextPage, hasNextPage, fetchNextPage } = useInfiniteFetch(
      (page) => getInterviewers({ ...params, page }),
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
      return <NoDataCard text="No interviewers found." />;
   }

   return (
      <div>
         <div className={`grid gap-5 2xl:gap-6 ${view === 'list' ? 'md:grid-cols-1' : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'}`}>

            {/* Interviewers List */}
            {
               data?.map((interviewer) => (
                  <InterviwerCard
                     key={interviewer.id}
                     interviewer={interviewer}
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
   <div className={`grid gap-5 2xl:gap-6 ${view === 'list' ? 'md:grid-cols-1' : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'}`}>
      {
         Array.from({ length: 6 }).map((_, i) => (
            <InterviewerCardSkeleton key={i} />
         ))
      }
   </div>
);


export default InterviewerList;