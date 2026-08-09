import PrimaryBody from '@/components/common/primary-body';
import PrimaryTitle from '@/components/common/primary-title';
import HeaderLayout from '@/components/layouts/header-layout';
import PageHeaderLayout from '@/components/layouts/page-header-layout';
import { AppointmentsHeaderData } from '@/data/appointmens/appointments.types';

interface AppointmentsHeaderProps {
   data: AppointmentsHeaderData;
}

const AppointmentsHeader = ({ data }: AppointmentsHeaderProps) => {
   return (
      <PageHeaderLayout>
         <HeaderLayout className='gap-4! items-start text-start mb-0! mx-0!'>
            <div className="flex items-center gap-3.5">
               <PrimaryTitle text={data.title} className="tracking-tight" />
               <div className="inline-flex items-center justify-center px-2.5 py-1 text-xs font-bold rounded-lg bg-zinc-900 border border-white/5 text-zinc-400">
                  {data.stats.length} Total
               </div>
            </div>
            <PrimaryBody
               text={data.body}
               className="max-w-2xl text-zinc-400 text-sm md:text-base leading-relaxed"
            />
         </HeaderLayout>

         {/* Quick Mini Stats Grid */}
         <div className="grid grid-cols-3 gap-2.5 w-full md:w-auto min-w-70">
            {
               data.stats.map((stat, index) => (
                  <div key={index} className="bg-zinc-900/40 border border-white/5 rounded-xl p-3 text-center">
                     <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold mb-0.5">{stat.title}</p>
                     <p className="text-lg font-bold text-violet-400">{stat.value}</p>
                  </div>
               ))
            }
         </div>
      </PageHeaderLayout>
   );
};

export default AppointmentsHeader;