'use client';

import { useState } from 'react';
import FilterSidebar from './components/filters/filter-sidebar';
import Header from './components/header';
import InterviewerList from './components/interviewer-list';
import useView from '@/hooks/use-view';
import { FilterParams } from './types/list.type';

const InterviewerListing = () => {
   const [openSidebar, setOpenSidebar] = useState<boolean>(false);
   const [hideFilters, setHideFilters] = useState<boolean>(false);
   const [filterParams, setFilterParams] = useState<FilterParams>({
      search: "",
      expertise: [],
      experience: []
   });

   const { view, setView } = useView();

   const handleClearFilters = () => {
      setFilterParams({
         search: "",
         expertise: [],
         experience: []
      });
   };

   return (
      <div className="container s-margin-t">

         {/* Header */}
         <Header
            onOpenSidebar={() => setOpenSidebar(prevState => !prevState)}
            onHideFilters={() => setHideFilters(prevState => !prevState)}
            hideFilters={hideFilters}
            view={view}
            setView={setView}
            filterParams={filterParams}
            onFilterParams={setFilterParams}
         />

         <div className={`${hideFilters ? '' : 'grid grid-cols-1 lg:grid-cols-[2.75fr_9.25fr] gap-6 2xl:gap-8 items-start'}`}>

            {/* Desktop Filter Sidebar */}
            {
               !hideFilters &&
               <div className="hidden lg:flex shrink-0 lg:sticky lg:top-22  lg:self-start">
                  <FilterSidebar
                     open={openSidebar}
                     onClose={setOpenSidebar}
                     filterParams={filterParams}
                     onFilterParams={setFilterParams}
                     onClear={() => handleClearFilters()}
                  />
               </div>
            }

            {/* Interviewer Grid */}
            <InterviewerList
               view={view}
               filterParams={filterParams}
            />

         </div>

      </div>
   );
};

export default InterviewerListing;