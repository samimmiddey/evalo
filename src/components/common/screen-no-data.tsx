import { cn } from "@/lib/utils";
import NoDataCard from "./no-data-card";

interface ScreenNoDataProps {
   text: string;
   className?: string;
}

const ScreenNoData = ({ text, className }: ScreenNoDataProps) => {
   return (
      <div className="s-padding-t">
         <div className={cn("w-full flex items-center justify-center min-h-[56vh]", className)}>
            <div
               className='flex items-center w-max'
            >
               <NoDataCard text={text} />
            </div>
         </div>
      </div>
   );
};

export default ScreenNoData;