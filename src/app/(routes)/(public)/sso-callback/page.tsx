import type { Metadata } from 'next';
import { PAGE_METADATA } from '@/constants/metadata';
import SSOCallback from '@/features/auth/sso-callback';
import { Suspense } from 'react';
import ScreenLoader from '@/components/common/screen-loader';

export const metadata: Metadata = PAGE_METADATA.ssoCallback;

const SSOCallbackPage = () => {
   return (
      <Suspense fallback={
         <ScreenLoader text="Loading..." className="min-h-screen" />
      }
      >
         <SSOCallback />
      </Suspense>
   );
};

export default SSOCallbackPage;