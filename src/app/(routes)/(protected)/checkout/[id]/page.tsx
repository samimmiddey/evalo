import type { Metadata } from 'next';
import { PAGE_METADATA } from '@/constants/metadata';
import Checkout from '@/features/checkout/checkout';

export const metadata: Metadata = PAGE_METADATA.checkout;

const CheckoutDynamicPage = async ({ params }: { params: Promise<{ id: string; }>; }) => {
   const { id } = await params;

   return (
      <Checkout id={id} />
   );
};

export default CheckoutDynamicPage;
