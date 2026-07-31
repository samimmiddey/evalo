import PrimaryBody from './primary-body';
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

const NoDataCard = ({ text, className }: { text: string; className?: string; }) => {
   return (
      <div className={cn('flex items-center justify-center px-4 py-3 rounded-md border border-red-500/20 bg-red-500/5 w-max gap-2 mx-auto', className)}>
         <AlertTriangle className='h-4 w-4 text-red-400' />
         <PrimaryBody text={text} className='text-center text-red-400 text-sm!' />
      </div>
   );
};

export default NoDataCard;