import PrimaryBody from '@/components/common/primary-body';
import SecondaryTitle from '@/components/common/secondary-title';
import CardLayout from '@/components/layouts/card-layout';
import { HelpfulTips as HelpfulTipsType } from '@/data/appointmens/appointments.types';
import { Info } from 'lucide-react';

interface HelpfulTipsProps {
   data: HelpfulTipsType;
}

const HelpfulTips = ({ data }: HelpfulTipsProps) => {
   return (
      <CardLayout className='mt-10 bg-amber-600/5 border-amber-600/20 hover:border-amber-600/25 hover:bg-amber-600/10 [--card-shadow-color:rgba(217,119,6,0.15)]'>
         <div className="flex max-sm:flex-col items-start gap-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
               <Info className="w-5 h-5" />
            </div>
            <div>
               <SecondaryTitle text={data.header} className="mb-2 text-amber-100" />
               <PrimaryBody text={data.body} className='text-xs! 2xl:text-sm! leading-relaxed text-amber-200/90' />
            </div>
         </div>
      </CardLayout>
   );
};

export default HelpfulTips;