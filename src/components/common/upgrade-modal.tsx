"use client";

import NoDataCard from '@/components/common/no-data-card';
import PricingCardContainer from '@/features/static/home/components/pricing-card-container';
import ModalWrapper from '@/components/wrappers/modal-wrapper';
import useUIStore from '@/store/ui-store';
import useSubscription from '@/hooks/use-subscription';
import ErrorCard from './error-card';
import PricingSkeleton from '@/features/static/home/components/skeletons/pricing-skeleton';
import { useAppUser } from '@/hooks/use-app-user';

const UpgradeModal = () => {
   const { allPlans, isLoading, error } = useSubscription();
   const { upgradeModal, setUpgradeModal } = useUIStore();
   const { user } = useAppUser();

   return (
      <ModalWrapper
         open={upgradeModal}
         onClose={() => setUpgradeModal(false)}
         title="Upgrade Your Plan"
         description="Choose the plan that fits your needs. Unlock more interview sessions, advanced feedback, and priority support."
      >
         {
            isLoading ? (
               <div className="scale-none sm:scale-98 lg:scale-96 2xl:scale-92 mt-2 sm:mt-0 lg:mt-4 2xl:mt-0 animate-pulse">
                  <PricingSkeleton />
               </div>
            ) : error ? (
               <ErrorCard text={error} />
            ) : !allPlans?.length ? (
               <div className="flex items-center justify-center py-20">
                  <NoDataCard text="No plans available" />
               </div>
            ) : (
               <div className="scale-none sm:scale-98 lg:scale-96 2xl:scale-92 mt-2 sm:mt-0 lg:mt-4 2xl:mt-0">
                  <PricingCardContainer
                     plans={allPlans}
                     disableAnimation={true}
                     className='pb-2 sm:pb-0 lg:pb-6 2xl:pb-2'
                     currentPlan={user?.role === 'CANDIDATE' ? user.currentPlan : undefined}
                     role={user?.role}
                  />
               </div>
            )
         }
      </ModalWrapper>
   );
};

export default UpgradeModal;