import React, { Suspense } from 'react';
import UserGate from './user-gate';
import ScreenLoader from '@/components/common/screen-loader';
import OnboardingProtection from './onboarding-protection';
import Navigation from '@/components/navigation/navigation';

const ProtectedLayout = ({ children }: { children: React.ReactNode; }) => {
   return (
      <Navigation>
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
      </Navigation>
   );
};

export default ProtectedLayout;