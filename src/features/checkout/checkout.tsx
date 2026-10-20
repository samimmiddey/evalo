"use client";

import HeaderLayout from "@/components/layouts/header-layout";
import PrimaryTitle from "@/components/common/primary-title";
import PrimaryBody from "@/components/common/primary-body";
import PlanSummaryCard from "./components/plan-summary-card";
import OrderSummaryCard from "./components/order-summary-card";
import BackButton from "@/components/common/back-button";
import EnhancedNoDataCard from "@/components/common/enhanced-no-data-card";
import ErrorCard from "@/components/common/error-card";
import useSubscription from "@/hooks/use-subscription";
import CheckoutSkeleton from "./components/skeletons/checkout-skeleton";
import { useAppUser } from "@/hooks/use-app-user";
import { checkoutData } from "@/data/checkout/checkout.data";

const Checkout = ({ id }: { id: string; }) => {
   const { allPlans, isLoading, error } = useSubscription();
   const { user, isLoading: isUserLoading, error: userError } = useAppUser();

   // Loading state
   if (isLoading || isUserLoading) {
      return (
         <CheckoutSkeleton />
      );
   }

   // Error State
   if (error || userError) {
      return (
         <CheckoutContainer>
            <ErrorCard text={error ?? userError ?? ''} />
         </CheckoutContainer>
      );
   }

   // No plan exists
   if (!allPlans?.length) {
      return (
         <CheckoutContainer>
            <EnhancedNoDataCard
               title='Plan not available'
               body='The selected subscription plan does not exist or is no longer available. Please choose an active plan from our pricing page.'
            />
         </CheckoutContainer>
      );
   }

   const selectedPlan = allPlans.find(plan => plan.id === id);

   // Check if selected plan exists or if it's the free plan
   if (!selectedPlan || selectedPlan.id === 'free') {
      return (
         <CheckoutContainer>
            <EnhancedNoDataCard
               title='Plan not available'
               body='The selected subscription plan does not exist or is no longer available. Please choose an active plan from our pricing page.'
            />
         </CheckoutContainer>
      );
   }

   // Check if it is the same plan as the user is subscribed to
   if (user?.currentPlan?.toLowerCase() === selectedPlan.name.toLowerCase()) {
      return (
         <CheckoutContainer>
            <EnhancedNoDataCard
               title='Already Subscribed'
               body='You are currently active on this plan. To change your subscription, please select a different tier from our pricing page.'
            />
         </CheckoutContainer>
      );
   }

   return (
      <CheckoutContainer>

         {/* 2-Column Responsive Layout: Plan on Left, Order Summary on Right */}
         <div className="grid grid-cols-1 lg:grid-cols-[7fr_5fr] gap-6 lg:gap-8 items-start">
            {/* Left Column: Selected Plan Details */}
            <div>
               <PlanSummaryCard plan={selectedPlan} />
            </div>

            {/* Right Column: Order Summary */}
            <div>
               <OrderSummaryCard plan={selectedPlan} />
            </div>
         </div>
      </CheckoutContainer>
   );
};

export default Checkout;

const CheckoutContainer = ({ children }: { children: React.ReactNode; }) => {
   const { header } = checkoutData;

   return (
      <div className="container s-margin px-4 md:px-6">
         {/* Navigation & Header */}
         <div className="space-y-4 mb-8">
            <BackButton
               link={header.backButton.link}
               title={header.backButton.title}
               Icon={header.backButton.icon}
            />

            <div className="max-w-2xl">
               <HeaderLayout className="gap-4! items-start text-start mb-0!">
                  <PrimaryTitle
                     text={header.title}
                  />
                  <PrimaryBody
                     text={header.description}
                  />
               </HeaderLayout>
            </div>
         </div>
         {children}
      </div>
   );
};
