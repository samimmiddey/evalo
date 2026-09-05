"use client";

import { Button } from '@/components/ui/button';
import { Coins } from 'lucide-react';
import { useState } from 'react';
import UpgradeModal from '@/components/common/upgrade-modal';
import useMediaQuery from '@/hooks/use-media-query';

interface CreditButtonProps {
   role?: string;
   credits?: number;
}

const CreditButton = ({ role, credits }: CreditButtonProps) => {
   const [openModal, setOpenModal] = useState<boolean>(false);

   const handleButton = () => {
      if (role === 'INTERVIEWEE') {
         setOpenModal(true);
      }
   };

   const lgWidth = useMediaQuery(1024);

   return (
      <>
         {
            credits ?
               <Button
                  variant='white'
                  className='rounded-md'
                  onClick={handleButton}
               >
                  <Coins className='icon-size' />
                  <span>
                     {credits} {!lgWidth && (role === 'INTERVIEWER' ? 'Earned' : 'Credits')}
                  </span>
               </Button> :
               <div className='h-9 w-full rounded-md animate-pulse bg-zinc-800' />
         }
         <UpgradeModal open={openModal} onClose={() => setOpenModal(prev => !prev)} />
      </>
   );
};

export default CreditButton;