import PrimaryBody from "@/components/common/primary-body";
import { Badge } from "@/components/ui/badge";
import { interviewsData } from "@/data/interviews/interviews.data";
import { FilterParams } from "../../types/list.type";

interface ExpertiseProps {
   filterParams: FilterParams;
   onFilterParams: React.Dispatch<React.SetStateAction<FilterParams>>;
}

const Expertise = ({ filterParams, onFilterParams }: ExpertiseProps) => {
   const handleExpertiseSelection = (category: string) => {
      onFilterParams(prevState => {
         if (prevState.expertise?.includes(category)) {
            return {
               ...prevState,
               expertise: prevState.expertise.filter((exp) => exp !== category)
            };
         }
         return {
            ...prevState,
            expertise: [...(prevState.expertise || []), category]
         };
      });
   };

   return (
      <div className="flex flex-col gap-2.5 2xl:gap-3">
         <PrimaryBody className="text-sm! font-medium! text-zinc-300!" text='Expertise' />
         <div className="flex flex-wrap gap-2 2xl:gap-2.5 w-full">
            {interviewsData.expertise.map((item) => (
               <Badge
                  key={item.value}
                  variant={filterParams.expertise?.includes(item.value) ? "default" : "outline"}
                  className={`
                     shrink-0 p-3 cursor-pointer transition-colors font-medium
                     ${filterParams.expertise?.includes(item.value)
                        ? 'bg-violet-500 hover:bg-violet-600 text-zinc-100 border-transparent'
                        : 'bg-zinc-900 border-white/10 text-zinc-400 hover:text-zinc-100 hover:border-white/20'
                     }
                  `}
                  onClick={() => handleExpertiseSelection(item.value)}
               >
                  {item.label}
               </Badge>
            ))}
         </div>
      </div>
   );
};

export default Expertise;