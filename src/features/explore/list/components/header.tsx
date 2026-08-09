import CustomTooltip from '@/components/common/custom-tooltip';
import PrimaryBody from '@/components/common/primary-body';
import PrimaryTitle from '@/components/common/primary-title';
import HeaderLayout from '@/components/layouts/header-layout';
import { Button } from '@/components/ui/button';
import useMediaQuery from '@/hooks/use-media-query';
import { ViewType } from '@/types/ui.types';
import { Filter, Grid2x2, Rows3 } from 'lucide-react';
import SearchBar from '../../../../components/common/search-bar';
import { FilterParams } from '../types/list.type';
import { exploreData } from '@/data/explore/explore.data';
import PageHeaderLayout from '@/components/layouts/page-header-layout';

interface HeaderProps {
   onOpenSidebar: () => void;
   onHideFilters: () => void;
   hideFilters: boolean;
   view: ViewType;
   setView: (view: ViewType) => void;
   filterParams: FilterParams;
   onFilterParams: React.Dispatch<React.SetStateAction<FilterParams>>;
};

const Header = ({ onOpenSidebar, onHideFilters, hideFilters, view, setView, filterParams, onFilterParams }: HeaderProps) => {
   const lgWidth = useMediaQuery(1024);

   return (
      <PageHeaderLayout>
         <div className="max-w-2xl">
            <HeaderLayout className='gap-4! items-start text-start mb-0!'>
               <PrimaryTitle text={exploreData.header.title} />
               <PrimaryBody text={exploreData.header.description} />
            </HeaderLayout>
         </div>

         <div className="flex items-center max-lg:justify-between gap-2.5 2xl:gap-3">
            <div className='block lg:hidden w-full'>
               <SearchBar
                  value={filterParams?.search}
                  setValue={e => onFilterParams(prevState => ({ ...prevState, search: e.target.value }))}
                  placeholder="Search interviewers..."
               />
            </div>
            <div className="flex items-center gap-2.5 2xl:gap-3">
               <CustomTooltip
                  trigger={
                     <Button
                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                           e.currentTarget.blur();

                           if (lgWidth) {
                              void onOpenSidebar();
                           } else {
                              void onHideFilters();
                           }
                        }}
                        variant="outline"
                        className={`max-lg:h-10 w-fit shrink-0 bg-zinc-900 hover:bg-zinc-800 border-white/10 text-zinc-100 ${hideFilters ? 'opacity-50! hover:opacity-60!' : 'opacity-100'}`}
                     >
                        <Filter className="w-4 h-4 md:mr-2" />
                        <span className='hidden md:block'>Filters</span>
                     </Button>
                  }
                  content={
                     <p>{hideFilters ? 'Show' : 'Hide'} Filters</p>
                  }
               />
               {
                  !lgWidth && (
                     <CustomTooltip
                        trigger={
                           <Button
                              onClick={() => setView(view === 'grid' ? 'list' : 'grid')}
                              variant="outline"
                              className="w-fit shrink-0 bg-zinc-900 hover:bg-zinc-800 border-white/10 text-zinc-100"
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
                  )
               }
            </div>
         </div>
      </PageHeaderLayout>
   );
};

export default Header;