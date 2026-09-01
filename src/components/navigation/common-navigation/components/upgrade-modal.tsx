"use client";

import CustomSpinner from '@/components/common/custom-spinner';
import NoDataCard from '@/components/common/no-data-card';
import PricingCardContainer from '@/features/static/home/components/pricing-card-container';
import { usePlans } from '@clerk/nextjs/experimental';
import ModalWrapper from '../../../wrappers/modal-wrapper';

interface UpgradeModalProps {
   open: boolean;
   onClose: () => void;
}

const UpgradeModal = ({ open, onClose }: UpgradeModalProps) => {
   const { data: plans, isLoading } = usePlans({ for: 'user', pageSize: 10 });

   return (
      <ModalWrapper
         open={open}
         onClose={onClose}
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
               <div className="scale-none sm:scale-95 2xl:scale-90 max-sm:mt-7 max-2xl:mt-6">
                  <PricingCardContainer
                     plans={plans}
                     disableAnimation={true}
                     className='pb-7 sm:pb-8 2xl:pb-4'
                  />
               </div>
            )
         }
      </ModalWrapper>
   );
};

export default UpgradeModal;