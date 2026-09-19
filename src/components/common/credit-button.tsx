"use client";

import { Button } from '@/components/ui/button';
import { Coins } from 'lucide-react';
import useMediaQuery from '@/hooks/use-media-query';
import useUIStore from '@/store/ui-store';

interface CreditButtonProps {
   role?: string;
   credits?: number;
   onCloseSidebar?: (value: boolean) => void;
}

const CreditButton = ({ role, credits, onCloseSidebar }: CreditButtonProps) => {
   const { setUpgradeModal } = useUIStore();

   const lgWidth = useMediaQuery(1024);

   const handleButton = () => {
      if (role === 'INTERVIEWEE') {
         setUpgradeModal(true);

         if (lgWidth && onCloseSidebar) {
            onCloseSidebar(false);
         }
      }
   };

   return (
      <>
         <Button
            variant='white'
            className='rounded-md'
            onClick={handleButton}
         >
            <Coins className='icon-size' />
            <span>
               {credits} {!lgWidth && (role === 'INTERVIEWER' ? 'Earned' : 'Credits')}
            </span>
         </Button>
      </>
   );
};

export default CreditButton;