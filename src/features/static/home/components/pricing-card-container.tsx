import { cn } from '@/lib/utils';
import { CustomPlan } from '../types/pricing.types';
import PricingCard from './pricing-card';

interface PricingCardContainerProps {
   plans: CustomPlan[];
   disableAnimation?: boolean;
   className?: string;
   currentPlan?: string;
   role?: string;
}

const PricingCardContainer = ({ plans, disableAnimation, className, currentPlan, role }: PricingCardContainerProps) => {
   return (
      <div className={cn("grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-7 2xl:gap-8 mx-auto w-full lg:max-w-6xl 2xl:max-w-7xl lg:pt-6 pb-10", className)}>
         {plans.map((plan, i) => (
            <PricingCard
               key={i}
               i={i}
               plan={plan}
               disableAnimation={disableAnimation}
               currentPlan={currentPlan}
               role={role}
            />
         ))}
      </div>
   );
};

export default PricingCardContainer;