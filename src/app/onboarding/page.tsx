import type { Metadata } from 'next';
import { PAGE_METADATA } from '@/constants/metadata';
import Onboarding from '@/features/onboarding/onboarding';
import { Suspense } from 'react';
import ScreenLoader from '@/components/common/screen-loader';

export const metadata: Metadata = PAGE_METADATA.onboarding;

const OnboardingPage = () => {
   return (
      <Suspense
         fallback={
            <ScreenLoader text="Loading..." className='min-h-screen' />
         }
      >
         <Onboarding />
      </Suspense>
   );
};

export default OnboardingPage;