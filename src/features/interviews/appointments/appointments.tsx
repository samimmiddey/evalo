'use client';

import AppointmentsHeader from './components/appointments-header';
import FilterBar from './components/filter-bar';
import { useEffect, useState } from 'react';
import { AppointmentsFilterParams, Feedback } from './types/appointments.types';
import useView from '@/hooks/use-view';
import AppointmentsList from './components/appointments-list';
import { useFetch } from '@/hooks/use-fetch';
import { getAppointmentsStats } from './services/appointments.client.service';
import { toast } from 'sonner';
import { FeedbackModal } from './components/feedback-modal';

const Appointments = () => {
   const [filterParams, setFilterParams] = useState<AppointmentsFilterParams>({
      search: "",
      status: undefined
   });

   const [selectedFeedbackId, setSelectedFeedbackId] = useState<string | null>(null);
   const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);

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
            onViewFeedback={(id, feedback) => {
               setSelectedFeedbackId(id);
               setSelectedFeedback(feedback);
            }}
         />

         {/* Feedback Modal */}
         {selectedFeedback && (
            <FeedbackModal
               open={selectedFeedbackId !== null}
               onClose={() => {
                  setSelectedFeedbackId(null);
                  setSelectedFeedback(null);
               }}
               feedback={selectedFeedback}
            />
         )}

      </div>
   );
};

export default Appointments;