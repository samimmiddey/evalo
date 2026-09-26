import type { Metadata } from 'next';
import { PAGE_METADATA } from '@/constants/metadata';
import SignUp from '@/features/auth/sign-up';

export const metadata: Metadata = PAGE_METADATA.signUp;

const SignUpPage = () => {
   return (
      <SignUp />
   );
};

export default SignUpPage;