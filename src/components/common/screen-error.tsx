import { cn } from "@/lib/utils";
import ErrorCard from "./error-card";

interface ScreenErrorProps {
   text: string;
   className?: string;
}

const ScreenError = ({ text, className }: ScreenErrorProps) => {
   return (
      <div className="s-padding-t">
         <div className={cn("w-full flex items-center justify-center min-h-[56vh]", className)}>
            <div
               className='flex items-center w-max'
            >
               <ErrorCard text={text} />
            </div>
         </div>
      </div>
   );
};

export default ScreenError;