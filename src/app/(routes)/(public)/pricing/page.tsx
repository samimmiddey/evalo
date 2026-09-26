import type { Metadata } from 'next';
import { PAGE_METADATA } from '@/constants/metadata';
import Pricing from '@/features/static/pricing/pricing';

export const metadata: Metadata = PAGE_METADATA.pricing;

const PricingPage = () => {
   return (
      <Pricing />
   );
};

export default PricingPage;