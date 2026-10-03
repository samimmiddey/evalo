"use client";

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
                                    <div className="flex items-center gap-3">
                                       <Avatar className="h-9 w-9 rounded-full border-2 border-white/10 bg-zinc-800 shrink-0">
                                          <AvatarImage
                                             src={item.candidate.imageUrl ?? ''}
                                             alt={`${item.candidate.firstName ?? ''} ${item.candidate.lastName ?? ''}`.trim() || 'Candidate'}
                                          />
                                          <AvatarFallback className="bg-violet-950 text-violet-300 font-bold text-xs rounded-full">
                                             {item.candidate.firstName && item.candidate.lastName
                                                ? `${item.candidate.firstName[0]}${item.candidate.lastName[0]}`.toUpperCase()
                                                : (item.candidate.firstName?.[0] ?? 'C').toUpperCase()}
                                          </AvatarFallback>
                                       </Avatar>
                                       <h4 className="font-semibold text-zinc-200 text-sm font-geist">
                                          {item.candidate.firstName ?? ''} {item.candidate.lastName ?? ''}
                                       </h4>
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
               <div className='mt-6 2xl:mt-8'>
                  <ListEndMessage
                     text="You've reached the end of the list"
                     className='p-0! border-none!'
                  />
               </div>
            )}

         </CardLayout>
         {/* Pagination trigger */}
         {hasNextPage && <div ref={sentinelRef} className="pointer-events-none h-4" />}
      </div>
   );
};

export default UserFeedback;