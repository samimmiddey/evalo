'use client';

import ScreenLoader from '@/components/common/screen-loader';
import { useClerk, useSignIn, useSignUp } from '@clerk/nextjs';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { ssoCallback } from './services/auth.service';
import { useRoleBasedRedirect } from '@/hooks/use-role-based-redirect';
import { sanitizeRedirectUrl } from '@/utils/redirect-url-sanitizer';

export default function SSOCallback() {
   const clerk = useClerk();
   const { signIn } = useSignIn();
   const { signUp } = useSignUp();
   const router = useRouter();
   const hasRun = useRef(false);

   const searchParams = useSearchParams();
   const redirectUrl = searchParams.get('redirect_url');
   const sanitizedUrl = sanitizeRedirectUrl(redirectUrl);

   const roleBasedRedirect = useRoleBasedRedirect();

   useEffect(() => {
      void (async () => {
         if (!clerk.loaded || !signIn || !signUp || hasRun.current) return;
         hasRun.current = true;

         await ssoCallback({
            clerk,
            signIn,
            signUp,
            onNavigateSignIn: () => {
               if (sanitizedUrl) {
                  router.replace(sanitizedUrl);
               } else {
                  void roleBasedRedirect();
               }
            },
            onNavigateSignUp: () => {
               const onboardingUrl = sanitizedUrl ?
                  `/onboarding?redirect_url=${encodeURIComponent(sanitizedUrl)}` :
                  '/onboarding';

               router.replace(onboardingUrl);
            },
            onTransferToSignIn: () => {
               const signInUrl = sanitizedUrl ?
                  `/sign-in?redirect_url=${encodeURIComponent(sanitizedUrl)}` :
                  '/sign-in';

               router.replace(signInUrl);
            },
         });
      })();
   }, [clerk, signIn, signUp]); // eslint-disable-line react-hooks/exhaustive-deps

   return (
      <div>
         {/* Render captcha in case a sign-in is transferred to a sign-up */}
         <div className='s-padding-t'>
            <ScreenLoader text='Signing you in...' />
         </div>
         <div id="clerk-captcha" />
      </div>
   );
};