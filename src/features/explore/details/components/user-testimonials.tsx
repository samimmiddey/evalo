import { DetailedInterviewer } from '@/data/explore/explore.types';
import { MessageSquare, Star } from 'lucide-react';

interface UserTestimonialsProps {
   interviewer: DetailedInterviewer;
}

const UserTestimonials = ({ interviewer }: UserTestimonialsProps) => {
   return (
      <div className="bg-zinc-900/20 border border-white/5 rounded-2xl p-6 md:p-8 space-y-5 2xl:space-y-6">
         <h2 className="text-base 2xl:text-lg font-bold text-zinc-100 flex items-center gap-2">
            <MessageSquare className="h-4 2xl:w-5 w-4 2xl:h-5 text-violet-400" />
            Candidate Reviews ({interviewer.testimonials.length})
         </h2>

         <div className="space-y-4">
            {interviewer.testimonials.map((t) => (
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
      </div>
   );
};

export default UserTestimonials;