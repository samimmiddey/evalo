import PrimaryBody from '@/components/common/primary-body';
import PrimaryTitle from '@/components/common/primary-title';
import HeaderLayout from '@/components/layouts/header-layout';
import PageHeaderLayout from '@/components/layouts/page-header-layout';
import { appointsData } from '@/data/appointments/appointments.data';

const AppointmentsHeader = () => {
   return (
      <PageHeaderLayout>
         <HeaderLayout className='gap-4! items-start text-start mb-0! mx-0!'>
            <PrimaryTitle text={appointsData.header.title} className="tracking-tight" />
            <PrimaryBody
               text={appointsData.header.body}
               className="max-w-2xl text-zinc-400 text-sm md:text-base leading-relaxed"
            />
         </HeaderLayout>
      </PageHeaderLayout>
   );
};

export default AppointmentsHeader;