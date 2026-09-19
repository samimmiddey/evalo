"use client";

import CustomSpinner from '@/components/common/custom-spinner';
import NoDataCard from '@/components/common/no-data-card';
import PricingCardContainer from '@/features/static/home/components/pricing-card-container';
import { usePlans } from '@clerk/nextjs/experimental';
import ModalWrapper from '@/components/wrappers/modal-wrapper';
import useUIStore from '@/store/ui-store';

const UpgradeModal = () => {
   const { data: plans, isLoading } = usePlans({ for: 'user', pageSize: 10 });

   const { upgradeModal, setUpgradeModal } = useUIStore();

   return (
      <ModalWrapper
         open={upgradeModal}
         onClose={() => setUpgradeModal(false)}
         title="Upgrade Your Plan"
         description="Choose the plan that fits your needs. Unlock more interview sessions, advanced feedback, and priority support."
      >
         {
            isLoading ? (
               <div className="flex items-center justify-center py-20">
                  <CustomSpinner text="Loading plans..." containerClass="justify-center" />
               </div>
            ) : !plans?.length ? (
               <div className="flex items-center justify-center py-20">
                  <NoDataCard text="No plans available" />
               </div>
            ) : (
               <div className="scale-none sm:scale-98 lg:scale-96 2xl:scale-92 mt-2 sm:mt-0 lg:mt-4 2xl:mt-0">
                  <PricingCardContainer
                     plans={plans}
                     disableAnimation={true}
                     className='pb-2 sm:pb-0 lg:pb-6 2xl:pb-2'
                  />
               </div>
            )
         }
      </ModalWrapper>
   );
};

export default UpgradeModal;