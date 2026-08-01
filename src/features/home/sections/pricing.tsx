"use client";

import HeaderText from '@/components/common/header-text';
import PrimaryBody from '@/components/common/primary-body';
import PrimaryTitle from '@/components/common/primary-title';
import HeaderLayout from '@/components/layouts/header-layout';
import { homeData } from '@/data/home/home.data';
import { usePlans } from '@clerk/nextjs/experimental';
import CustomSpinner from '@/components/common/custom-spinner';
import NoDataCard from '@/components/common/no-data-card';
import PricingCardContainer from '../components/pricing-card-container';

const Pricing = () => {
   const { data: plans, isLoading } = usePlans({ for: 'user', pageSize: 10 });

   // Loading state
   if (isLoading) {
      return <CustomSpinner text='Loading plans...' containerClass='justify-center' />;
   }

   // No plan exists
   if (!plans?.length) {
      return (
         <div className="s-margin-t container">
            <NoDataCard text='No plans available' />
         </div>
      );
   }

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

         <PricingCardContainer plans={plans} />
      </div>
   );
};

export default Pricing;