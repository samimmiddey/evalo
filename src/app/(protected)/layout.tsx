import React, { Suspense } from 'react';
import UserGate from './user-gate';
import ScreenLoader from '@/components/common/screen-loader';

const ProtectedLayout = ({ children }: { children: React.ReactNode; }) => {
   return (
      <Suspense fallback={<ScreenLoader text="Preparing your workspace..." />}>
         <UserGate>
            {children}
         </UserGate>
      </Suspense>
   );
};

export default ProtectedLayout;