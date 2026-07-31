import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';

interface ErrorCardProps {
   text: string;
   className?: string;
}

const ErrorCard = ({ text, className }: ErrorCardProps) => {
   return (
      <div className={cn("flex flex-col items-center justify-center p-8 bg-zinc-900/40 border border-red-500/10 rounded-2xl w-full", className)}>
         <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
            <AlertCircle className="w-6 h-6 text-red-500" />
         </div>
         <h3 className="text-lg font-medium text-zinc-100 mb-2">Something went wrong</h3>
         <p className="text-sm text-zinc-400 text-center max-w-md">
            {text || "An unexpected error occurred. Please try again later."}
         </p>
      </div>
   );
};

export default ErrorCard;