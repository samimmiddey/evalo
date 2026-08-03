import PrimaryBody from "@/components/common/primary-body";
import { Checkbox } from "@/components/ui/checkbox";
import { FilterParams } from "../../types/list.type";
import { exploreData } from "@/data/explore/explore.data";

interface ExperienceProps {
   filterParams: FilterParams;
   onFilterParams: React.Dispatch<React.SetStateAction<FilterParams>>;
}

const Experience = ({ filterParams, onFilterParams }: ExperienceProps) => {
   const handleExperience = (checked: boolean | string, level: string) => {
      onFilterParams(prevState => {
         if (checked) {
            return {
               ...prevState,
               experience: [...(prevState.experience || []), level]
            };
         }

         return {
            ...prevState,
            experience: [...(prevState.experience || []).filter(exp => exp !== level)]
         };
      });
   };

   return (
      <div className="flex flex-col gap-2.5 2xl:gap-3">
         <h3 className="text-sm font-medium text-zinc-300">Experience</h3>
         <div className="flex flex-col gap-3">
            {exploreData.experience.map((item) => (
               <label htmlFor={item.value} key={item.value} className="flex items-center gap-3 cursor-pointer group">
                  <Checkbox
                     id={item.value}
                     className="w-4 h-4 shrink-0"
                     checked={filterParams?.experience?.includes(item.value)}
                     onCheckedChange={(checked) => handleExperience(checked, item.value)}
                  />
                  <PrimaryBody
                     className="text-sm! text-zinc-400 group-hover:text-zinc-200 transition-colors"
                     text={item.label}
                  />
               </label>
            ))}
         </div>
      </div>
   );
};

export default Experience;