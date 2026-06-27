import { Quote, Star } from 'lucide-react'
import { TestimonialCard as TestimonialCardType } from '@/data/home/home.types'

interface TestimonialCardProps {
   testimonial: TestimonialCardType
}

const TestimonialCard = ({ testimonial }: TestimonialCardProps) => {
   return (
      <div className="group relative h-full rounded-3xl bg-linear-to-b from-white/10 to-white/5 p-px transition-all duration-500 hover:from-violet-500/50 hover:to-fuchsia-500/50 hover:shadow-[0_0_40px_-10px_rgba(139,92,246,0.2)]">
         <div className="relative flex flex-col h-full bg-surface-dark rounded-[calc(1.5rem-1px)] p-7 lg:p-8 2xl:p-9 overflow-hidden">

            {/* Top Glow on hover */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-violet-500/20 blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            {/* Header: Avatar + Info */}
            <div className="flex items-center gap-4 mb-6 2xl:mb-8 relative z-10">
               <div className="relative">
                  <div className="h-12 2xl:w-14 w-12 2xl:h-14 rounded-full bg-linear-to-br from-violet-500 to-fuchsia-600 p-[2px]">
                     <div className="w-full h-full rounded-full bg-surface-dark flex items-center justify-center text-white font-bold text-xl">
                        {testimonial.avatar}
                     </div>
                  </div>
                  {/* Verified check badge */}
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-surface-dark rounded-full flex items-center justify-center">
                     <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                           <polyline points="20 6 9 17 4 12" />
                        </svg>
                     </div>
                  </div>
               </div>

               <div className="flex flex-col">
                  <span className="text-white font-semibold text-[17px] 2xl:text-lg">{testimonial.name}</span>
                  <span className="text-violet-400 text-[13px] 2xl:text-sm font-medium">{testimonial.role}</span>
               </div>
            </div>

            {/* Stars */}
            <div className="flex gap-1 mb-4 2xl:mb-5 relative z-10">
               {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-3.5 2xl:w-4 w-3.5 2xl:h-4 text-amber-400 fill-amber-400" />
               ))}
            </div>

            {/* Review text */}
            <p className="text-gray-300 text-sm lg:text-[15px] 2xl:text-[17px] leading-relaxed relative z-10 grow font-inter">
               {testimonial.review}
            </p>

            {/* Large background quote icon */}
            <Quote className="absolute -bottom-6 -right-6 w-32 h-32 text-white/2 group-hover:text-violet-500/5 transition-colors duration-500 -rotate-12 pointer-events-none" />
         </div>
      </div>
   )
}

export default TestimonialCard
