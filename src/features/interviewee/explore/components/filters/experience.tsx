import PrimaryBody from "@/components/common/primary-body";
import { Checkbox } from "@/components/ui/checkbox";

const Experience = () => {
   return (
      <div className="flex flex-col gap-2.5 2xl:gap-3">
         <h3 className="text-sm font-medium text-zinc-300">Experience</h3>
         <div className="flex flex-col gap-3">
            {['Entry Level (0-2 yrs)', 'Mid Level (3-5 yrs)', 'Senior (6-9 yrs)', 'Staff+ (10+ yrs)'].map((level) => (
               <label htmlFor={level} key={level} className="flex items-center gap-3 cursor-pointer group">
                  <Checkbox
                     id={level}
                     className="w-4 h-4 shrink-0"
                  />
                  <PrimaryBody
                     className="text-sm! text-zinc-400 group-hover:text-zinc-200 transition-colors"
                     text={level}
                  />
               </label>
            ))}
         </div>
      </div>
   );
};

export default Experience;