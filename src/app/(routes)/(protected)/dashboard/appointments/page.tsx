import type { Metadata } from 'next';
import { PAGE_METADATA } from '@/constants/metadata';
import Appointments from '@/features/interviews/appointments/appointments';

export const metadata: Metadata = PAGE_METADATA.appointments;

const AppointmentsPage = () => {
   return (
      <Appointments />
   );
};

export default AppointmentsPage;