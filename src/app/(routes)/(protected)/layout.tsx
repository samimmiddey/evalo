import React, { Suspense } from 'react';
import UserGate from './user-gate';
import ScreenLoader from '@/components/common/screen-loader';
import OnboardingProtection from './onboarding-protection';

const ProtectedLayout = ({ children }: { children: React.ReactNode; }) => {
   return (
      <Suspense
         fallback={
            <div className='s-padding-t'>
               <ScreenLoader text="Loading..." />
            </div>
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