"use client"

import useEmblaCarousel from 'embla-carousel-react'
import AutoScroll from 'embla-carousel-auto-scroll'
import HeaderText from '@/components/common/header-text'
import PrimaryBody from '@/components/common/primary-body'
import PrimaryTitle from '@/components/common/primary-title'
import HeaderLayout from '@/components/layouts/header-layout'
import { homeData } from '@/data/home/home.data'
import TestimonialCard from './components/testimonial-card'

const Testimonials = () => {
   const [emblaRefTop] = useEmblaCarousel(
      { loop: true, watchDrag: false },
      [AutoScroll({ playOnInit: true, stopOnInteraction: false, stopOnMouseEnter: false, stopOnFocusIn: false, speed: 0.75 })]
   )

   const [emblaRefBottom] = useEmblaCarousel(
      { loop: true, watchDrag: false, direction: 'rtl' },
      [AutoScroll({ playOnInit: true, stopOnInteraction: false, stopOnMouseEnter: false, stopOnFocusIn: false, speed: 0.75 })]
   )

   // Duplicate arrays to guarantee enough items for seamless infinite loop
   const row1 = [...homeData.testimonials.reviews, ...homeData.testimonials.reviews];
   const row2 = [...homeData.testimonials.reviews, ...homeData.testimonials.reviews].reverse();

   return (
      <div className='s-margin-t w-full overflow-hidden'>
         <div className="container">
            <HeaderLayout>
               <HeaderText
                  icon={homeData.testimonials.icon}
                  text={homeData.testimonials.header}
               />
               <PrimaryTitle text={homeData.testimonials.title} className='mt-1 2xl:mt-2' />
               <PrimaryBody
                  text={homeData.testimonials.description}
               />
            </HeaderLayout>
         </div>

         <div className="relative w-full">
            <div className="brands-cover flex flex-col gap-5 2xl:gap-6">
               {/* Top Row */}
               <div className="overflow-hidden" ref={emblaRefTop}>
                  <div className="flex">
                     {row1.map((testimonial, i) => (
                        <div key={`top-${i}`} className="flex-none pl-5 2xl:pl-6 w-[320px] md:w-[400px] xl:w-[450px]">
                           <TestimonialCard testimonial={testimonial} />
                        </div>
                     ))}
                  </div>
               </div>

               {/* Bottom Row */}
               <div className="overflow-hidden" ref={emblaRefBottom} dir="rtl">
                  <div className="flex">
                     {row2.map((testimonial, i) => (
                        <div key={`bottom-${i}`} className="flex-none pl-5 2xl:pl-6 w-[320px] md:w-[400px] xl:w-[450px]" dir="ltr">
                           <TestimonialCard testimonial={testimonial} />
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}

export default Testimonials