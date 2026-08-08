import PrimaryBody from './primary-body';
import { Database } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NoDataCardProps {
   text: string;
   className?: string;
   iconClassName?: string;
   textClassName?: string;
}

const NoDataCard = ({ text, className, iconClassName, textClassName }: NoDataCardProps) => {
   return (
      <div className={cn('flex items-center justify-center px-4 py-3 rounded-lg border border-zinc-500/20 bg-zinc-500/5 w-max gap-2 mx-auto', className)}>
         <Database className={cn('h-4 w-4 text-zinc-400', iconClassName)} />
         <PrimaryBody text={text} className={cn('text-center text-zinc-400 text-sm!', textClassName)} />
      </div>
   );
};

export default NoDataCard;