import { cn } from '@/lib/utils';
import { BotMessageSquare } from 'lucide-react';

interface LogoProps {
   iconClassName?: string;
   textClassName?: string;
}

const Logo = ({ iconClassName, textClassName }: LogoProps) => {
   return (
      <div className={cn("flex items-center gap-1.5 text-violet-400", iconClassName)}>
         <BotMessageSquare className="mt-0.5 h-6.5 w-6.5" />
         <h4 className={cn("font-musemoderno font-bold text-xl", textClassName)}>evalo</h4>
      </div>
   );
};

export default Logo;