import { useMemo } from 'react';
import { useFetch } from './use-fetch';
import { fetchPlans } from '@/services/client/global.client.service';
import { homeData } from '@/data/home/home.data';

// Helper function to sort plans according to the rank
const getRank = (name: string) => {
   const n = name.toLowerCase();
   if (n.includes('starter')) return 0;
   if (n.includes('pro')) return 1;
   return 2;
};

const useSubscription = () => {
   const { data: plans, isLoading, error } = useFetch(fetchPlans);

   // All plans
   const allPlans = useMemo(() => {
      const apiPlans = plans?.plans ?? [];

      // Adjust the cashfree plans with additional data
      const modifiedPlans = apiPlans.map(item => {
         const matchedItem = homeData.pricing.plans.find(plan => plan.title.toLowerCase() === item.plan_name.toLocaleLowerCase());

         return {
            id: item.plan_id,
            name: item.plan_name,
            amount: item.plan_recurring_amount,
            status: item.plan_status,
            features: matchedItem?.features ?? [],
            description: matchedItem?.description ?? '',
            credit: matchedItem?.credit ?? '',
            isPopular: matchedItem?.isPopular ?? false
         };
      });

      // Sort the plans by rank
      const sortedPlans = [...modifiedPlans].sort((a, b) => getRank(a.name) - getRank(b.name));

      // Free plan
      const freePlan = homeData.pricing.plans.find(plan => plan.title.toLowerCase() === 'free');

      // All plans combined
      return [
         {
            id: 'free',
            name: freePlan?.title ?? 'Free',
            amount: 0,
            status: 'ACTIVE',
            features: freePlan?.features ?? [],
            description: freePlan?.description ?? '',
            credit: freePlan?.credit ?? '',
            isPopular: freePlan?.isPopular ?? false
         },
         ...sortedPlans
      ];
   }, [plans?.plans]);

   return { allPlans, isLoading, error };
};

export default useSubscription;