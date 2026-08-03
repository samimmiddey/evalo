import CardLayout from '@/components/layouts/card-layout';
import { interviewerDetailsData } from '@/data/explore/explore.data';
import { Star } from 'lucide-react';
import HeaderTitle from './header-title';

const UserTestimonials = () => {
   return (
      <CardLayout className='space-y-5 2xl:space-y-6'>
         <HeaderTitle
            title={interviewerDetailsData.testimonial.title}
            icon={interviewerDetailsData.testimonial.icon}
         />

         <div className="space-y-4">
            {interviewerDetailsData.interviewers[2].testimonials.map((t) => (
               <div key={t.id} className="p-4 rounded-xl bg-zinc-900 border border-white/5 space-y-3">
                  <div className="flex items-center justify-between">
                     <div>
                        <h4 className="font-semibold text-zinc-200 text-sm mb-1">{t.authorName}</h4>
                        <p className="text-xs text-zinc-400">{t.role}</p>
                     </div>
                     <div className="flex items-center gap-1">
                        {Array.from({ length: t.rating }).map((_, i) => (
                           <Star key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        ))}
                     </div>
                  </div>
                  <p className="text-sm text-zinc-300 leading-relaxed font-light italic">
                     &ldquo;{t.comment}&rdquo;
                  </p>
                  <span className="text-[11px] text-zinc-500 block">{t.date}</span>
               </div>
            ))}
         </div>
      </CardLayout>
   );
};

export default UserTestimonials;