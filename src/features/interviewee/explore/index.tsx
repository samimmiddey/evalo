'use client';

import { useState } from 'react';
import FilterSidebar from './components/filters/filter-sidebar';
import Header from './components/header';
import InterviewerList from './components/interviewer-list';
import useView from '@/hooks/use-view';
import { useFetch } from '@/hooks/use-fetch';
import { getInterviewers } from '../services/client/interviewee.service';

const Explore = () => {
   const [openSidebar, setOpenSidebar] = useState<boolean>(false);
   const [hideFilters, setHideFilters] = useState<boolean>(false);

   const { view, setView } = useView();

   const { isLoading, data, error } = useFetch(() => getInterviewers());

   return (
      <div className="container s-margin-t">

         {/* Header */}
         <Header
            onOpenSidebar={() => setOpenSidebar(prevState => !prevState)}
            onHideFilters={() => setHideFilters(prevState => !prevState)}
            hideFilters={hideFilters}
            view={view}
            setView={setView}
         />

         <div className={`${hideFilters ? '' : 'grid grid-cols-1 lg:grid-cols-[2.75fr_9.25fr] gap-6 2xl:gap-8 items-start'}`}>

            {/* Desktop Filter Sidebar */}
            {
               !hideFilters &&
               <div className="hidden lg:flex shrink-0 lg:sticky lg:top-22  lg:self-start">
                  <FilterSidebar
                     open={openSidebar}
                     onClose={setOpenSidebar}
                  />
               </div>
            }

            {/* Interviewer Grid */}
            <InterviewerList
               view={view}
               interviewers={data || []}
               isLoading={isLoading}
            />

         </div>

      </div>
   );
};

export default Explore;