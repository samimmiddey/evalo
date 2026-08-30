"use client";

import { Button } from '@/components/ui/button';
import { Coins } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import UpgradeModal from './upgrade-modal';
import useMediaQuery from '@/hooks/use-media-query';

interface CreditButtonProps {
   role?: string;
   credits?: number;
}

const CreditButton = ({ role, credits }: CreditButtonProps) => {
   const [openModal, setOpenModal] = useState<boolean>(false);

   const router = useRouter();

   const handleButton = () => {
      if (role === 'INTERVIEWER') {
         router.push('/dashboard');
      } else {
         setOpenModal(true);
      }
   };

   const lgWidth = useMediaQuery(1024);

   return (
      <>
         <Button
            variant='outline'
            className='bg-violet-500/15 hover:bg-violet-500/20 transition-colors'
            size='lg'
            onClick={handleButton}
         >
            <Coins className='icon-size' />
            <span>
               {credits} {!lgWidth && (role === 'INTERVIEWER' ? 'Earned' : 'Credits')}
            </span>
         </Button>
         <UpgradeModal open={openModal} onClose={() => setOpenModal(prev => !prev)} />
      </>
   );
};

export default CreditButton;