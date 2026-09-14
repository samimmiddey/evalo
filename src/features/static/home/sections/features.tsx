"use client";

import HeaderText from '@/components/common/header-text';
import PrimaryBody from '@/components/common/primary-body';
import PrimaryTitle from '@/components/common/primary-title';
import HeaderLayout from '@/components/layouts/header-layout';
import { homeData } from '@/data/home/home.data';
import FeatureCard from '../components/feature-card';

const Features = () => {
   return (
      <section className='s-padding-t container relative'>
         <HeaderLayout>
            <HeaderText
               icon={homeData.features.icon}
               text={homeData.features.header}
            />
            <PrimaryTitle text={homeData.features.title} />
            <PrimaryBody
               text={homeData.features.description}
            />
         </HeaderLayout>

         {/* Bento Grid Layout */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 lg:gap-6 2xl:gap-7">
            {homeData.features.cards.map((feature, i) => {
               const gridSpan =
                  i === 0
                     ? 'md:col-span-2 lg:col-span-7'
                     : i === 1
                        ? 'md:col-span-2 lg:col-span-5'
                        : i === 4
                           ? 'md:col-span-2 lg:col-span-4'
                           : 'md:col-span-1 lg:col-span-4';

               return (
                  <FeatureCard
                     key={i}
                     i={i}
                     feature={feature}
                     className={gridSpan}
                  />
               );
            })}
         </div>
      </section>
   );
};

export default Features;