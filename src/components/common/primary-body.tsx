import { cn } from '@/lib/utils';

interface PrimaryBodyProps {
   text: string;
   className?: string;
}

const PrimaryBody = ({ text, className }: PrimaryBodyProps) => {
   return (
      <p className={cn('font-inter text-sm lg:text-base 2xl:text-lg text-zinc-400', className)}>
         {text}
      </p>
   );
};

export default PrimaryBody;