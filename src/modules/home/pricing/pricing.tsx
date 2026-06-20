"use client"

import HeaderText from '@/components/common/header-text'
import PrimaryBody from '@/components/common/primary-body'
import PrimaryTitle from '@/components/common/primary-title'
import HeaderLayout from '@/components/layouts/header-layout'
import { homeData } from '@/data/home/home.data'
import PricingCard from './components/pricing-card'

const Pricing = () => {
   return (
      <div className='s-margin-t container'>
         <HeaderLayout>
            <HeaderText
               icon={homeData.pricing.icon}
               text={homeData.pricing.header}
            />
            <PrimaryTitle text={homeData.pricing.title} className='mt-1 2xl:mt-2' />
            <PrimaryBody
               text={homeData.pricing.description}
            />
         </HeaderLayout>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-7 2xl:gap-8 mx-auto w-full lg:max-w-6xl 2xl:max-w-7xl lg:pt-6 pb-10">
            {homeData.pricing.plans.map((plan, i) => (
               <PricingCard key={i} i={i} plan={plan} />
            ))}
         </div>
      </div>
   )
}

export default Pricing