import { Quote, Star, CheckCircle2 } from "lucide-react";
import { TestimonialCard as TestimonialCardType } from "@/data/home/home.types";
import PrimaryBody from "@/components/common/primary-body";
import SecondaryTitle from "@/components/common/secondary-title";
import { cn } from "@/lib/utils";

const AVATAR_VARIANTS = [
   {
      container: "bg-violet-500/15 border-violet-500/30 text-violet-300",
      badge: "text-violet-400",
   },
   {
      container: "bg-emerald-500/15 border-emerald-500/30 text-emerald-300",
      badge: "text-emerald-400",
   },
   {
      container: "bg-sky-500/15 border-sky-500/30 text-sky-300",
      badge: "text-sky-400",
   },
   {
      container: "bg-rose-500/15 border-rose-500/30 text-rose-300",
      badge: "text-rose-400",
   },
   {
      container: "bg-amber-500/15 border-amber-500/30 text-amber-300",
      badge: "text-amber-400",
   },
   {
      container: "bg-indigo-500/15 border-indigo-500/30 text-indigo-300",
      badge: "text-indigo-400",
   },
];

interface TestimonialCardProps {
   testimonial: TestimonialCardType;
   index?: number;
}

const TestimonialCard = ({ testimonial, index = 0 }: TestimonialCardProps) => {
   const color = AVATAR_VARIANTS[index % AVATAR_VARIANTS.length];

   return (
      <div className="group relative flex flex-col justify-between h-full px-6 py-7 sm:p-7 2xl:p-8 rounded-3xl bg-surface-dark border border-white/8 backdrop-blur-2xl overflow-hidden transition-colors duration-300 hover:border-violet-500/40 shadow-[0_12px_40px_rgba(0,0,0,0.6)] select-none">

         <div className="relative z-10 space-y-4">
            {/* Header: Avatar, Name & Role */}
            <div className="flex items-center gap-3.5">
               {/* Avatar with initials & verified badge */}
               <div className="relative shrink-0">
                  <div
                     className={cn(
                        "w-11 h-11 2xl:w-12 2xl:h-12 rounded-xl border flex items-center justify-center font-bold text-base 2xl:text-lg shadow-sm",
                        color.container
                     )}
                  >
                     {testimonial.avatar}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-surface-dark flex items-center justify-center">
                     <CheckCircle2 className={cn("w-3.5 h-3.5", color.badge)} />
                  </div>
               </div>

               {/* Name and Role */}
               <div className="min-w-0">
                  <SecondaryTitle
                     text={testimonial.name}
                     className="text-[15px] sm:text-lg 2xl:text-[19px] tracking-tight group-hover:text-white transition-colors duration-200 truncate font-outfit"
                  />
                  <PrimaryBody
                     text={testimonial.role}
                     className="text-xs sm:text-[13px] lg:text-[13px] 2xl:text-sm truncate mt-0.5"
                  />
               </div>
            </div>

            {/* Star Rating Badge */}
            <div className="w-fit flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/3 border border-white/8 shrink-0 mt-6">
               <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                     <Star key={i} className="w-3 2xl:w-3.5 h-3 2xl:h-3.5 text-amber-400 fill-amber-400" />
                  ))}
               </div>
               <span className="text-[11px] 2xl:text-xs font-mono font-medium text-zinc-300 ml-0.5">5.0</span>
            </div>

            {/* Review Quote Body */}
            <PrimaryBody
               text={testimonial.review}
               className="text-zinc-300 text-sm sm:text-[15px] lg:text-[15px] 2xl:text-[17px] leading-relaxed group-hover:text-zinc-200 transition-colors duration-200"
            />
         </div>

         {/* Large Subtle Background Watermark Icon */}
         <Quote className="pointer-events-none absolute -bottom-4 -right-4 w-24 h-24 text-white/2 group-hover:text-violet-400/4 -rotate-12 transition-colors duration-500" />
      </div>
   );
};

export default TestimonialCard;
