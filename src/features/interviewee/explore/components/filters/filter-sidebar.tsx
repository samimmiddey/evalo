import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Filter } from 'lucide-react';
import SearchBar from './search-bar';
import Expertise from './expertise';
import Experience from './experience';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from '@/components/ui/drawer';
import CustomTooltip from '@/components/common/custom-tooltip';
import { FilterParams } from '../../types/explore.type';

interface FilterSidebarProps {
   open: boolean;
   onClose: (value: boolean) => void;
   filterParams: FilterParams;
   onFilterParams: React.Dispatch<React.SetStateAction<FilterParams>>;
   onClear: () => void;
};

const FilterSidebar = ({ open, onClose, filterParams, onFilterParams, onClear }: FilterSidebarProps) => {
   return (
      <>
         {/* Desktop View */}
         <div className="hidden lg:block w-full h-full">
            <SidebarContent
               filterParams={filterParams}
               onFilterParams={onFilterParams}
               onClear={onClear}
            />
         </div>

         {/* Mobile View */}
         <div className="lg:hidden">
            <Drawer
               open={open}
               onOpenChange={onClose}
            >
               <DrawerContent
                  aria-describedby={undefined}
                  className="bg-zinc-950 border-t border-white/10 py-2 px-6 flex flex-col z-9999 overflow-hidden"
               >
                  <DrawerHeader className='p-0! mb-4 mt-2 shrink-0'>
                     <DrawerTitle className="m-0 text-lg font-semibold text-zinc-100 flex items-center gap-2">
                        <Filter className="w-4 h-4 text-violet-400" />
                        Filters
                     </DrawerTitle>
                  </DrawerHeader>

                  <div className="flex-1 overflow-y-auto min-h-0 pr-2">
                     <SidebarContent
                        filterParams={filterParams}
                        onFilterParams={onFilterParams}
                        onClear={onClear}
                     />
                  </div>

                  <DrawerFooter className="px-0 py-4 border-t border-white/10 flex-row justify-between gap-4 shrink-0 m-0! w-full bg-zinc-950">
                     <Button
                        variant="outline"
                        className="w-auto flex-1"
                     >
                        Clear
                     </Button>
                     <Button
                        variant='white'
                        className="w-auto flex-1"
                        onClick={() => onClose(false)}
                     >
                        Apply
                     </Button>
                  </DrawerFooter>
               </DrawerContent>
            </Drawer>
         </div>
      </>
   );
};

interface SidebarContentProps {
   filterParams: FilterParams;
   onFilterParams: React.Dispatch<React.SetStateAction<FilterParams>>;
   onClear: () => void;
}

const SidebarContent = ({ filterParams, onFilterParams, onClear }: SidebarContentProps) => {
   return (
      <div className="flex flex-col gap-4 h-full pb-6 lg:pb-8">

         <div className="hidden lg:flex items-center justify-between">
            <h2 className="text-lg font-semibold text-zinc-100 flex items-center gap-2">
               <Filter className="w-4 h-4 text-violet-400" />
               Filters
            </h2>
            <CustomTooltip
               trigger={
                  <Button
                     variant="ghost"
                     size="sm"
                     className="text-xs! px-3"
                     onClick={onClear}
                  >
                     Clear
                  </Button>
               }
               content={
                  <p>Clear Filters</p>
               }
            />
         </div>

         <Separator className='my-1 hidden lg:block' />

         {/* Search Bar */}
         <div className='hidden lg:block'>
            <SearchBar
               filterParams={filterParams}
               onFilterParams={onFilterParams}
            />
         </div>

         <Separator className='my-2' />

         {/* Expertise */}
         <Expertise
            filterParams={filterParams}
            onFilterParams={onFilterParams}
         />

         <Separator className='my-2' />

         {/* Experience */}
         <Experience
            filterParams={filterParams}
            onFilterParams={onFilterParams}
         />

      </div>
   );
};

export default FilterSidebar;