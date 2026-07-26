import { Badge } from "@/components/ui/badge";

const CATEGORIES = [
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

const Categories = () => {
   return (
      <div className="flex items-center gap-3 pb-4 mb-8">
         {CATEGORIES.map((category, index) => (
            <Badge
               key={category}
               className={`
                     shrink-0 px-4 py-3 text-sm cursor-pointer transition-colors font-medium
                     ${index === 0
                     ? 'bg-violet-500 hover:bg-violet-600 text-white border-transparent'
                     : 'bg-zinc-900/50 border-white/10 text-zinc-400 hover:text-white hover:border-white/20'
                  }
                  `}
            >
               {category}
            </Badge>
         ))}
      </div>
   );
};

export default Categories;