import PrimaryBody from '@/components/common/primary-body';
import { BadgeCheck } from 'lucide-react';
import CardLayout from '@/components/layouts/card-layout';
import { interviewerDetailsData } from '@/data/explore/explore.data';
import HeaderTitle from './header-title';
import { homeData } from '@/data/home/home.data';

const WhatToExpect = ({ currentPlan }: { currentPlan: string; }) => {
   const plan = homeData.pricing.plans.find(p => p.title.toLowerCase() === currentPlan);

   return (
      <CardLayout>
         <div className="space-y-4 2xl:space-y-5 relative z-10">
            <HeaderTitle
               title={interviewerDetailsData.whatToExpect.header.title}
               icon={interviewerDetailsData.whatToExpect.header.icon}
            />

            <ul className="space-y-3">
               {plan?.features.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                     <BadgeCheck className="mt-1 h-4 2xl:w-4.5 w-4 2xl:h-4.5 text-violet-400" />
                     <PrimaryBody
                        className="leading-relaxed text-sm! 2xl:text-base! text-zinc-300"
                        text={item}
                     />
                  </li>
               ))}
            </ul>
         </div>
      </CardLayout>
   );
};

export default WhatToExpect;
