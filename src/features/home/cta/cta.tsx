"use client"

import HeaderText from '@/components/common/header-text'
import PrimaryBody from '@/components/common/primary-body'
import PrimaryTitle from '@/components/common/primary-title'
import HeaderLayout from '@/components/layouts/header-layout'
import { homeData } from '@/data/home/home.data'
import { Button } from '@/components/ui/button'

const CTA = () => {
   return (
      <div className='s-margin-t container'>
         <div className="group relative rounded-4xl overflow-hidden bg-surface-dark/80 border border-violet-500/25 transition-all duration-300 hover:translate-y-[-5px] hover:border-violet-500/50 hover:bg-surface-hover/90 hover:shadow-glow-violet px-7 py-16 lg:py-20 2xl:py-24">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-violet-500/20 rounded-full blur-3xl group-hover:bg-violet-500/50 transition-colors duration-500" />

            <HeaderLayout className="mb-0 lg:mb-0 2xl:mb-0 relative z-10">
               <HeaderText
                  icon={homeData.cta.icon}
                  text={homeData.cta.header}
               />
               <PrimaryTitle text={homeData.cta.title} className='mt-1 2xl:mt-2 text-gray-100' />
               <PrimaryBody
                  text={homeData.cta.description}
                  className="w-full md:max-w-2xl 2xl:max-w-3xl mx-auto text-gray-300"
               />

               <div className="flex items-center justify-center gap-3 2xl:gap-4 mt-3 2xl:mt-4">
                  <Button size="xxl" variant="white">Get Started</Button>
                  <Button size="xxl" variant="outline">Browse Interviews</Button>
               </div>
            </HeaderLayout>
         </div>
      </div>
   )
}

export default CTA
