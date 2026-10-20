"use client";

import HeaderText from '@/components/common/header-text';
import PrimaryBody from '@/components/common/primary-body';
import PrimaryTitle from '@/components/common/primary-title';
import HeaderLayout from '@/components/layouts/header-layout';
import { homeData } from '@/data/home/home.data';
import NoDataCard from '@/components/common/no-data-card';
import PricingCardContainer from '../components/pricing-card-container';
import { useAppUser } from '@/hooks/use-app-user';
import useSubscription from '@/hooks/use-subscription';
import ErrorCard from '@/components/common/error-card';
import PricingSkeleton from '../components/skeletons/pricing-skeleton';

const Pricing = () => {
   const { user } = useAppUser();
   const { allPlans, isLoading, error } = useSubscription();

   // Loading state
   if (isLoading) {
      return (
         <div className="s-margin-t container animate-pulse">
            <PricingSkeleton />
         </div>
      );
   }

   // Error State
   if (error) {
      return (
         <div className="container s-margin-t">
            <ErrorCard text={error} />
         </div>
      );
   }

   // No plan exists
   if (!allPlans?.length) {
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
            <PrimaryTitle text={homeData.pricing.title} />
            <PrimaryBody
               text={homeData.pricing.description}
            />
         </HeaderLayout>

         <PricingCardContainer
            plans={allPlans}
            currentPlan={user?.role === 'CANDIDATE' ? user.currentPlan : undefined}
            role={user?.role}
         />
      </div>
   );
};

export default Pricing;