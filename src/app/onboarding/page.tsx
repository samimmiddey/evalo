import type { Metadata } from 'next';
import { PAGE_METADATA } from '@/constants/metadata';
import Onboarding from '@/features/onboarding/onboarding';

export const metadata: Metadata = PAGE_METADATA.onboarding;

const OnboardingPage = () => {
   return (
      <Onboarding />
   );
};

export default OnboardingPage;