import CardLayout from '@/components/layouts/card-layout';
import { interviewerDetailsData } from '@/data/explore/explore.data';
import { Star } from 'lucide-react';
import HeaderTitle from './header-title';
import { InterviewerFeedback } from '../types/details.types';
import NoDataCard from '@/components/common/no-data-card';
import { formatDate } from '@/utils/format-date';

interface UserFeedbackProps {
   feedback: InterviewerFeedback;
}

const UserFeedback = ({ feedback }: UserFeedbackProps) => {
   return (
      <CardLayout className='space-y-5 2xl:space-y-6'>
         <HeaderTitle
            title={interviewerDetailsData.testimonial.title}
            icon={interviewerDetailsData.testimonial.icon}
         />
         {
            feedback.bookingsAsInterviewer.length === 0 ? (
               <NoDataCard
                  text='No user feedback available'
                  className='bg-transparent border-0'
               />
            ) : (
               <div className="space-y-4">
                  {feedback.bookingsAsInterviewer.map((item) => (
                     <div key={item.id} className="p-4 rounded-xl bg-zinc-900 border border-white/5 space-y-3">
                        <div className="flex items-center justify-between">
                           <div>
                              <h4 className="font-semibold text-zinc-200 text-sm mb-1">
                                 {item.interviewee.firstName ?? ''} {item.interviewee.lastName ?? ''}
                              </h4>
                              <p className="text-xs text-zinc-400">{item.interviewee.designation ?? ''}</p>
                           </div>
                           <div className="flex items-center gap-1">
                              {Array.from({ length: item.feedback?.sessionRating ?? 0 }).map((_, i) => (
                                 <Star key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                              ))}
                           </div>
                        </div>
                        <p className="text-sm text-zinc-300 leading-relaxed font-light italic">
                           &ldquo;{item.feedback?.sessionComment ?? 'Unable to show comment'}&rdquo;
                        </p>
                        <span className="text-[11px] text-zinc-500 block">{formatDate(item.interviewee.createdAt)}</span>
                     </div>
                  ))}
               </div>
            )
         }
      </CardLayout>
   );
};

export default UserFeedback;