'use client';

import { appointsData } from '@/data/appointmens/appointments.data';
import AppointmentCard from './components/appointment-card';
import HelpfulTips from './components/helpful-tips';
import AppointmentsHeader from './components/appointments-header';
import EnhancedNoDataCard from '@/components/common/enhanced-no-data-card';
import FilterBar from './components/filter-bar';

const Appointments = () => {
   return (
      <div className="container s-margin-t">

         {/* Page Header */}
         <AppointmentsHeader data={appointsData.header} />

         {/* Filter and Navigation Bar */}
         <FilterBar />

         {/* Appointment Listings */}
         {appointsData.appointments.length === 0 ? (
            /* Empty State */
            <EnhancedNoDataCard
               title="No appointments yet"
               body="We couldn't find any appointments matching your filters. Book a time slot with our vetted professionals to start practicing."
               showButton={true}
               buttonText="Explore Interviewers"
               buttonLink="/explore"
            />
         ) : (
            /* Cards Container */
            <div className="space-y-6 relative z-10">
               {
                  appointsData.appointments.map((appointment) => (
                     <AppointmentCard
                        key={appointment.id}
                        appointment={appointment}
                     />
                  ))
               }
            </div>
         )}

         {/* Helpful tips / FAQ section */}
         <HelpfulTips data={appointsData.helpfulTips} />

      </div>
   );
};

export default Appointments;