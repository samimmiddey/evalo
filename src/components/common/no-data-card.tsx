import PrimaryBody from './primary-body';
import { AlertTriangle } from 'lucide-react';

const NoDataCard = ({ text }: { text: string; }) => {
   return (
      <div className='flex items-center justify-center px-4 py-3 rounded-md border border-red-500/20 bg-red-500/5 w-max gap-2 mx-auto'>
         <AlertTriangle className='h-4 w-4 text-red-400' />
         <PrimaryBody text={text} className='text-center text-red-400 text-sm!' />
      </div>
   );
};

export default NoDataCard;