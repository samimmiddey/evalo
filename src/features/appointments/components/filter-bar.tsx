import { Badge } from '@/components/ui/badge';
import { appointsData } from '@/data/appointmens/appointments.data';
import { Search } from 'lucide-react';
import { useMemo } from 'react';

const FilterBar = () => {
   // Statistics Calculations
   const stats = useMemo(() => {
      return {
         all: appointsData.appointments.length,
         upcoming: appointsData.appointments.filter(a => a.status === 'upcoming' || a.status === 'in-progress').length,
         completed: appointsData.appointments.filter(a => a.status === 'completed').length,
         cancelled: appointsData.appointments.filter(a => a.status === 'cancelled').length,
      };
   }, []);

   return (
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-2 bg-zinc-900/40 border border-white/5 rounded-xl mb-7 2xl:mb-8 relative z-10 backdrop-blur-xl">
         <div className="lg:flex lg:flex-wrap lg:items-center max-lg:grid max-lg:grid-cols-4 max-sm:grid-cols-2 gap-2">
            {(['all', 'upcoming', 'completed', 'cancelled'] as const).map((tab) => {
               const isActive = 'all' === tab;
               const count = stats[tab];
               return (
                  <Badge
                     key={tab}
                     variant='outline'
                     className={`max-lg:w-full flex items-center gap-2 px-4! h-10 text-sm font-medium rounded-lg! transition-all duration-200 cursor-pointer ${isActive ? 'bg-violet-500/10 border-violet-500/30 hover:bg-violet-500/20 text-violet-300' : 'bg-zinc-900 border-white/10 text-zinc-400 hover:text-zinc-100 hover:border-white/20'}`}
                  >
                     <span className="capitalize">{tab}</span>
                     <span
                        className={`inline-flex items-center justify-center h-5 w-5 text-xs rounded-md ${isActive ? 'bg-violet-500/20 text-violet-300' : 'bg-zinc-800 text-zinc-400'
                           }`}
                     >
                        {count}
                     </span>
                  </Badge>
               );
            })}
         </div>

         {/* Search & Simulation Controls */}
         <div className="flex items-center gap-3.5 w-full lg:w-auto">
            <div className="relative flex-1 lg:flex-initial">
               <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
               <input
                  type="text"
                  placeholder="Search interviewer or skill..."
                  className="w-full lg:w-64 bg-zinc-950/60 text-zinc-200 pl-10 pr-4 py-2 text-sm rounded-xl border border-white/5 focus:outline-none focus:border-violet-500/50 transition-colors"
               />
            </div>
         </div>
      </div>
   );
};

export default FilterBar;