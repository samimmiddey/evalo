import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Filter } from 'lucide-react';
import SearchBar from './search-bar';
import Expertise from './expertise';
import Experience from './experience';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from '@/components/ui/drawer';
import CustomTooltip from '@/components/common/custom-tooltip';
import { FilterParams } from '../../types/explore.type';
import { useEffect, useState } from 'react';

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
            <DesktopSidebar
               filterParams={filterParams}
               onFilterParams={onFilterParams}
               onClear={onClear}
            />
         </div>

         {/* Mobile View */}
         <div className="lg:hidden">
            <MobileSidebar
               open={open}
               onClose={onClose}
               filterParams={filterParams}
               onFilterParams={onFilterParams}
               onClear={onClear}
            />
         </div>
      </>
   );
};

interface DesktopSidebarProps {
   filterParams: FilterParams;
   onFilterParams: React.Dispatch<React.SetStateAction<FilterParams>>;
   onClear: () => void;
}

const DesktopSidebar = ({ filterParams, onFilterParams, onClear }: DesktopSidebarProps) => {
   return (
      <div className="flex flex-col gap-4 h-full pb-6 lg:pb-8">

         <div className="flex items-center justify-between">
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

         <Separator className='my-1' />

         {/* Search Bar */}
         <SearchBar
            filterParams={filterParams}
            onFilterParams={onFilterParams}
         />

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

interface MobileSidebarProps {
   open: boolean;
   onClose: (value: boolean) => void;
   filterParams: FilterParams;
   onFilterParams: React.Dispatch<React.SetStateAction<FilterParams>>;
   onClear: () => void;
}

const MobileSidebar = ({ open, onClose, filterParams, onFilterParams, onClear }: MobileSidebarProps) => {
   const [currentParams, setCurrentParams] = useState<FilterParams>(filterParams);

   useEffect(() => {
      if (open) {
         // eslint-disable-next-line react-hooks/set-state-in-effect
         setCurrentParams(filterParams);
      }
   }, [open, filterParams]);

   const handleApply = () => {
      onFilterParams(currentParams);
      onClose(false);
   };

   const handleClear = () => {
      onClear();
      onClose(false);
   };

   const hasChanges = JSON.stringify(currentParams) !== JSON.stringify(filterParams);

   return (
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
               <div className="flex flex-col gap-4 h-full pb-6 lg:pb-8">

                  <Separator className='my-2' />

                  {/* Expertise */}
                  <Expertise
                     filterParams={currentParams}
                     onFilterParams={setCurrentParams}
                  />

                  <Separator className='my-2' />

                  {/* Experience */}
                  <Experience
                     filterParams={currentParams}
                     onFilterParams={setCurrentParams}
                  />

               </div>
            </div>

            <DrawerFooter className="px-0 py-4 border-t border-white/10 flex-row justify-between gap-4 shrink-0 m-0! w-full bg-zinc-950">
               <Button
                  variant="destructive"
                  className="w-auto flex-1"
                  onClick={handleClear}
                  disabled={
                     currentParams?.expertise?.length === 0 &&
                     currentParams?.experience?.length === 0 &&
                     currentParams?.search === ""
                  }
               >
                  Clear
               </Button>
               <Button
                  variant='white'
                  className="w-auto flex-1"
                  onClick={handleApply}
                  disabled={!hasChanges}
               >
                  Apply
               </Button>
            </DrawerFooter>
         </DrawerContent>
      </Drawer>
   );
};

export default FilterSidebar;