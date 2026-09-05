import React, { Suspense } from 'react';
import UserGate from './user-gate';
import ScreenLoader from '@/components/common/screen-loader';
import OnboardingProtection from './onboarding-protection';

const ProtectedLayout = ({ children }: { children: React.ReactNode; }) => {
   return (
      <Suspense
         fallback={
            <ScreenLoader text="Loading..." className='min-h-screen' />
         }
      >
         <OnboardingProtection>
            <UserGate>
               {children}
            </UserGate>
         </OnboardingProtection>
      </Suspense>
   );
};

export default ProtectedLayout;