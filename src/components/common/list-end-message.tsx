import PrimaryBody from './primary-body';
import { ListEnd } from 'lucide-react';
import { cn } from '@/lib/utils';

const ListEndMessage = ({ text, className }: { text: string; className?: string; }) => {
   return (
      <div className={cn('flex items-center justify-center px-4 py-3 rounded-lg bg-zinc-900/40 border border-dashed border-white/10 w-max gap-2 mx-auto', className)}>
         <ListEnd className='h-4 w-4 text-zinc-400' />
         <PrimaryBody text={text} className='text-center text-zinc-400 text-sm!' />
      </div>
   );
};

export default ListEndMessage;