'use client';

import ScreenLoader from '@/components/common/screen-loader';
import { useClerk, useSignIn, useSignUp } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { ssoCallback } from './services/auth.service';

export default function SSOCallback() {
   const clerk = useClerk();
   const { signIn } = useSignIn();
   const { signUp } = useSignUp();
   const router = useRouter();
   const hasRun = useRef(false);

   useEffect(() => {
      void (async () => {
         if (!clerk.loaded || !signIn || !signUp || hasRun.current) return;
         hasRun.current = true;

         await ssoCallback({
            clerk,
            signIn,
            signUp,
            onNavigate: () => router.push('/dashboard'),
            onTransferToSignIn: () => router.push('/sign-in'),
         });
      })();
   }, [clerk, signIn, signUp]); // eslint-disable-line react-hooks/exhaustive-deps

   return (
      <div>
         {/* Render captcha in case a sign-in is transferred to a sign-up */}
         <ScreenLoader text='Signing you in...' />
         <div id="clerk-captcha" />
      </div>
   );
};