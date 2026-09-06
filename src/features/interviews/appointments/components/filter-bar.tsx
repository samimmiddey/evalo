import CustomTooltip from '@/components/common/custom-tooltip';
import SearchBar from '@/components/common/search-bar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Grid2x2, Rows3 } from 'lucide-react';
import { useMemo } from 'react';
import { ViewType } from '@/types/ui.types';
import { AppointmentsFilterParams, AppointmentsStatsData, InterviewStatus } from '../types/appointments.types';
import useMediaQuery from '@/hooks/use-media-query';

interface FilterBarProps {
   view: ViewType;
   setView: (view: ViewType) => void;
   filterParams: AppointmentsFilterParams;
   onFilterParams: React.Dispatch<React.SetStateAction<AppointmentsFilterParams>>;
   data: AppointmentsStatsData | null;
   isLoading: boolean;
}

const FilterBar = ({ view, setView, filterParams, onFilterParams, data, isLoading }: FilterBarProps) => {
   const stats = useMemo(() => {
      if (!data) return {
         all: 0,
         scheduled: 0,
         completed: 0,
         cancelled: 0
      };

      return {
         all: data?.totalCount,
         scheduled: data?.scheduledCount,
         completed: data?.completedCount,
         cancelled: data?.cancelledCount
      };
   }, [data]);

   const lgWidth = useMediaQuery(1024);

   return (
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-2 bg-zinc-900/40 border border-white/5 rounded-xl mb-7 2xl:mb-8 relative z-10 backdrop-blur-xl">
         <div className="lg:flex lg:flex-wrap lg:items-center max-lg:grid max-lg:grid-cols-4 max-sm:grid-cols-2 gap-2">
            {(['all', 'scheduled', 'completed', 'cancelled'] as const).map((tab) => {
               const isActive = new Set([filterParams.status?.toLowerCase() ?? 'all']).has(tab);
               const count = stats[tab];
               return (
                  <Badge
                     key={tab}
                     variant='outline'
                     onClick={() => onFilterParams({ ...filterParams, status: tab === 'all' ? undefined : tab.toUpperCase() as InterviewStatus })}
                     className={`max-lg:w-full flex items-center gap-2 px-4! h-10 text-sm font-medium rounded-lg! transition-all duration-200 cursor-pointer ${isActive ? 'bg-violet-500/15 border-violet-500/30 hover:bg-violet-500/20 text-violet-300' : 'bg-zinc-900 border-white/10 text-zinc-400 hover:text-zinc-100 hover:border-white/20'}`}
                  >
                     <span className="capitalize">{tab}</span>
                     {
                        isLoading ? (
                           <span className={`h-5 w-5 rounded-md animate-pulse ${isActive ? 'bg-violet-500/25' : 'bg-zinc-800'
                              }`} />
                        ) : (
                           <span
                              className={`inline-flex items-center justify-center h-5 w-5 text-xs rounded-md ${isActive ? 'bg-violet-500/25 text-violet-300' : 'bg-zinc-800 text-zinc-400'
                                 }`}
                           >
                              {count}
                           </span>

                        )
                     }
                  </Badge>
               );
            })}
         </div>

         {/* Search & Simulation Controls */}
         <div className="flex items-center gap-2.5 w-full lg:w-86 2xl:w-90">
            <SearchBar
               value={filterParams?.search || ''}
               setValue={e => onFilterParams({ ...filterParams, search: e.target.value })}
               showLabel={false}
               placeholder='Search interviews...'
               inputClassName='h-10!'
            />
            {
               !lgWidth &&
               <CustomTooltip
                  trigger={
                     <Button
                        onClick={() => setView(view === 'grid' ? 'list' : 'grid')}
                        variant="outline"
                        className="w-fit shrink-0 h-10! bg-zinc-900 hover:bg-zinc-800 border-white/10 text-zinc-100"
                     >
                        {
                           view === 'list' ?
                              <Rows3 className="w-4 h-4" /> :
                              <Grid2x2 className="w-4 h-4" />
                        }
                     </Button>
                  }
                  content={
                     <p>View {view === 'list' ? 'Grid' : 'List'} </p>
                  }
               />
            }
         </div>
      </div>
   );
};

export default FilterBar;