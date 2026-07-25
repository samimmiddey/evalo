import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import React from 'react';

const OnboardingProtection = async ({ children }: { children: React.ReactNode; }) => {
   const { isAuthenticated, sessionClaims, redirectToSignIn } = await auth();

   // Protect the page from unauthenticated users
   if (!isAuthenticated) return redirectToSignIn();

   // Enforce the onboarding requirement at the resource
   if (!sessionClaims?.metadata?.onboardingComplete) {
      redirect('/onboarding');
   }

   return (
      <>
         {children}
      </>
   );
};

export default OnboardingProtection;