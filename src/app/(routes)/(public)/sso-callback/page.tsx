import type { Metadata } from 'next';
import { PAGE_METADATA } from '@/constants/metadata';
import SSOCallback from '@/features/auth/sso-callback';

export const metadata: Metadata = PAGE_METADATA.ssoCallback;

const SSOCallbackPage = () => {
   return (
      <SSOCallback />
   );
};

export default SSOCallbackPage;