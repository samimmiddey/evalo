'use client';

import AppointmentsHeader from './components/appointments-header';
import FilterBar from './components/filter-bar';
import { useEffect, useState } from 'react';
import { AppointmentsFilterParams } from './types/appointments.types';
import useView from '@/hooks/use-view';
import AppointmentsList from './components/appointments-list';
import { useFetch } from '@/hooks/use-fetch';
import { getAppointmentsStats } from './services/appointments.client.service';
import { toast } from 'sonner';

const Appointments = () => {
   const [filterParams, setFilterParams] = useState<AppointmentsFilterParams>({
      search: "",
      status: undefined
   });

   const { isLoading, data, error } = useFetch(() => getAppointmentsStats());

   const { view, setView } = useView('list');

   useEffect(() => {
      if (error) {
         toast.error(error);
      }
   }, [error]);

   return (
      <div className="container s-margin-t">

         {/* Page Header */}
         <AppointmentsHeader
            data={data}
            isLoading={isLoading}
         />

         {/* Filter and Navigation Bar */}
         <FilterBar
            view={view}
            setView={setView}
            filterParams={filterParams}
            onFilterParams={setFilterParams}
            data={data}
            isLoading={isLoading}
         />

         {/* Appointment Listings */}
         <AppointmentsList
            filterParams={filterParams}
            view={view}
         />

      </div>
   );
};

export default Appointments;