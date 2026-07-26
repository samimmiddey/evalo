import PrimaryBody from '@/components/common/primary-body';
import PrimaryTitle from '@/components/common/primary-title';
import HeaderLayout from '@/components/layouts/header-layout';
import { Button } from '@/components/ui/button';
import useMediaQuery from '@/hooks/use-media-query';
import { ViewType } from '@/models/ui.types';
import { Filter, Grid2x2, Rows3 } from 'lucide-react';

interface HeaderProps {
   onOpenSidebar: () => void;
   onHideFilters: () => void;
   hideFilters: boolean;
   view: ViewType;
   setView: (view: ViewType) => void;
};

const Header = ({ onOpenSidebar, onHideFilters, hideFilters, view, setView }: HeaderProps) => {
   const lgWidth = useMediaQuery(1024);

   return (
      <div className="flex max-lg:flex-col lg:items-end lg:justify-between gap-4 mb-8 lg:mb-9 2xl:mb-10">
         <div className="max-w-2xl">
            <HeaderLayout className='gap-4! items-start text-start mb-0!'>
               <PrimaryTitle text='Find your perfect interviewer' />
               <PrimaryBody text='Connect with industry experts from top companies for mock interviews, career guidance, and technical mentorship.' />
            </HeaderLayout>
         </div>

         <div className="flex items-center gap-2.5 2xl:gap-3">
            <Button
               onClick={() => {
                  if (lgWidth) {
                     void onOpenSidebar();
                  } else {
                     void onHideFilters();
                  }
               }}
               variant="outline"
               className={`w-fit shrink-0 ${hideFilters ? 'bg-violet-900/15! hover:bg-violet-900/25! border-violet-600/30! text-violet-300!' : 'bg-zinc-900/50 hover:bg-zinc-800 border-white/10 text-white'}`}
            >
               <Filter className="w-4 h-4 mr-2" />
               Filters
            </Button>
            <Button
               onClick={() => setView(view === 'grid' ? 'list' : 'grid')}
               variant="outline"
               className="w-fit shrink-0 bg-zinc-900/50 hover:bg-zinc-800 border-white/10 text-white"
            >
               {
                  view === 'list' ?
                     <Rows3 className="w-4 h-4" /> :
                     <Grid2x2 className="w-4 h-4" />
               }
            </Button>
         </div>
      </div>
   );
};

export default Header;