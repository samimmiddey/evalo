"use client"

import HeaderText from '@/components/common/header-text'
import PrimaryBody from '@/components/common/primary-body'
import PrimaryTitle from '@/components/common/primary-title'
import HeaderLayout from '@/components/layouts/header-layout'
import { homeData } from '@/data/home/home.data'
import { Zap } from 'lucide-react'
import FeatureCard from './components/feature-card'

const Features = () => {
   return (
      <div className='s-margin-t container'>
         <HeaderLayout>
            <HeaderText
               icon={Zap}
               text='Built for Excellence'
            />
            <PrimaryTitle text="Everything You Need to Succeed" className='mt-1 2xl:mt-2' />
            <PrimaryBody
               text="Practice and complete interviews easily with structured assessments, clear instructions, and real-time feedback designed to help you improve."
            />
         </HeaderLayout>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 2xl:gap-6">
            {homeData.features.map((feature, i) => {
               const Icon = feature.icon;
               return (
                  <FeatureCard
                     key={i}
                     i={i}
                     feature={feature}
                     Icon={Icon}
                     className={i === 0 ? "sm:col-span-2 lg:col-span-2" : ""}
                  />
               )
            })}
         </div>
      </div>
   )
}

export default Features