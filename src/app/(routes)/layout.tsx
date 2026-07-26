import React from 'react';
import Navigation from '@/components/navigation/navigation';

const RouteLayout = ({ children }: { children: React.ReactNode; }) => {
   return (
      <Navigation>
         {children}
      </Navigation>
   );
};

export default RouteLayout;