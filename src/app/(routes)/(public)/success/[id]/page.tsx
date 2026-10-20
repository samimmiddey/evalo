import type { Metadata } from 'next';
import { PAGE_METADATA } from '@/constants/metadata';
import CustomSuccess from '@/features/special/custom-success';

export const metadata: Metadata = PAGE_METADATA.success;

const SuccessPage = async ({ params }: { params: Promise<{ id: string; }>; }) => {
   const { id } = await params;

   return (
      <CustomSuccess id={id} />
   );
};

export default SuccessPage;
