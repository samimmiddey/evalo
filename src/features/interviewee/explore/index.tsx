'use client';

import Header from './components/header';
import InterviewerList from './components/interviewer-list';
import SearchBar from './components/filters/search-bar';
import Categories from './components/filters/categories';

const Explore = () => {
   return (
      <div className="container s-margin-t">

         {/* Page Header */}
         <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <Header />

            {/* Search Bar */}
            <SearchBar />
         </div>

         {/* Categories / Filters */}
         <Categories />

         {/* Interviewer Grid */}
         <InterviewerList />
      </div>
   );
};

export default Explore;