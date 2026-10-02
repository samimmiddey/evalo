"use client";

import CardLayout from '@/components/layouts/card-layout';
import { interviewerDetailsData } from '@/data/interviews/interviews.data';
import { Star } from 'lucide-react';
import HeaderTitle from './header-title';
import NoDataCard from '@/components/common/no-data-card';
import { formatDate } from '@/utils/format-date';
import { useInfiniteFetch } from '@/hooks/use-infinite-fetch';
import { getFeedback } from '../services/details.client.service';
import { usePaginationTrigger } from '@/hooks/use-pagination-trigger';
import ErrorCard from '@/components/common/error-card';
import ListEndMessage from '@/components/common/list-end-message';
import FeedbackSkeletonLoader from './skeleton/feedback-skeleton-loader';

const UserFeedback = ({ id }: { id: string; }) => {
   const params = {
      id,
      page: 1,
      pageSize: 10
   };

   const { isLoading, data, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteFetch(
      (page) => getFeedback({ ...params, page }),
      [id]
   );

   const { ref: sentinelRef } = usePaginationTrigger({
      onIntersect: fetchNextPage,
      enabled: hasNextPage,
      isFetching: isFetchingNextPage
   });

   return (
      <div>
         <CardLayout className='space-y-5 2xl:space-y-6'>
            <HeaderTitle
               title={interviewerDetailsData.testimonial.title}
               icon={interviewerDetailsData.testimonial.icon}
            />
            {
               isLoading ? <FeedbackSkeletonLoader /> : (
                  error ? <ErrorCard text={error} className='mb-0!' /> : (
                     data.length === 0 ? (
                        <NoDataCard
                           text='No user feedback available'
                           className='bg-transparent border-0 mb-5 2xl:mb-6'
                        />
                     ) : (
                        <div className="space-y-4">
                           {data.map((item) => (
                              <div key={item.id} className="p-4 rounded-xl bg-zinc-900 border border-white/5 space-y-3">
                                 <div className="flex items-center justify-between">
                                    <div>
                                       <h4 className="font-semibold text-zinc-200 text-sm mb-1 font-geist">
                                          {item.candidate.firstName ?? ''} {item.candidate.lastName ?? ''}
                                       </h4>
                                       <p className="text-xs text-zinc-400">{item.candidate.designation ?? ''}</p>
                                    </div>
                                    <div className="flex items-center gap-1">
                                       {Array.from({ length: item.review?.rating ?? 0 }).map((_, i) => (
                                          <Star key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                                       ))}
                                    </div>
                                 </div>
                                 <p className="text-sm text-zinc-300 leading-relaxed font-light italic">
                                    {item.review?.comment ?? 'N/A'}
                                 </p>
                                 <span className="text-[11px] text-zinc-500 block">
                                    {item.review?.createdAt ? formatDate(item.review.createdAt) : 'N/A'}
                                 </span>
                              </div>
                           ))}
                        </div>
                     )
                  )
               )
            }

            {/* Loading more state */}
            {isFetchingNextPage && <FeedbackSkeletonLoader />}

            {/* Empty state */}
            {!hasNextPage && data?.length > 0 && (
               <div className='mt-8 2xl:mt-10'>
                  <ListEndMessage text="You've reached the end of the list" />
               </div>
            )}

         </CardLayout>
         {/* Pagination trigger */}
         {hasNextPage && <div ref={sentinelRef} className="pointer-events-none h-4" />}
      </div>
   );
};

export default UserFeedback;