import Navigation from '@/components/navigation/navigation';
import React from 'react';

const PublicLayout = ({ children }: { children: React.ReactNode; }) => {
   return (
      <Navigation>
         {children}
      </Navigation>
   );
};

export default PublicLayout;