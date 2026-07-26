import PrimaryBody from "@/components/common/primary-body";
import { Badge } from "@/components/ui/badge";

const EXPERTISE = [
   'All',
   'Frontend',
   'Backend',
   'System Design',
   'UI/UX',
   'Mobile',
   'Data Science',
   'Machine Learning',
   'Leadership'
];

const Expertise = () => {
   return (
      <div className="flex flex-col gap-2.5 2xl:gap-3">
         <PrimaryBody className="text-sm! font-medium! text-zinc-300!" text='Expertise' />
         <div className="flex flex-wrap gap-2.5 2xl:gap-3 w-full">
            {EXPERTISE.map((category, index) => (
               <Badge
                  key={category}
                  className={`
                     shrink-0 p-3 text-sm cursor-pointer transition-colors font-medium
                     ${index === 0
                        ? 'bg-violet-500 hover:bg-violet-600 text-white border-transparent'
                        : 'bg-zinc-900 border-white/10 text-zinc-400 hover:text-white hover:border-white/20'
                     }
                  `}
               >
                  {category}
               </Badge>
            ))}
         </div>
      </div>
   );
};

export default Expertise;