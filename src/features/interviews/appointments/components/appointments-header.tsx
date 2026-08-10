import PrimaryBody from '@/components/common/primary-body';
import PrimaryTitle from '@/components/common/primary-title';
import HeaderLayout from '@/components/layouts/header-layout';
import PageHeaderLayout from '@/components/layouts/page-header-layout';
import { AppointmentsStatsData } from '../types/appointments.types';
import { appointsData } from '@/data/appointments/appointments.data';

interface AppointmentsHeaderProps {
   data: AppointmentsStatsData | null;
   isLoading: boolean;
}

const AppointmentsHeader = ({ data, isLoading }: AppointmentsHeaderProps) => {
   return (
      <PageHeaderLayout>
         <HeaderLayout className='gap-4! items-start text-start mb-0! mx-0!'>
            <PrimaryTitle text={appointsData.header.title} className="tracking-tight" />
            <PrimaryBody
               text={appointsData.header.body}
               className="max-w-2xl text-zinc-400 text-sm md:text-base leading-relaxed"
            />
         </HeaderLayout>

         {/* Quick Mini Stats Grid */}
         <div className="grid grid-cols-3 gap-2.5 w-full md:w-auto min-w-70">
            <div className="bg-zinc-900/40 border border-white/5 rounded-xl p-3 text-center">
               <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold mb-1">Completed</p>
               {
                  isLoading ?
                     <span className='inline-flex h-5.5 w-5.5 rounded-md animate-pulse bg-zinc-700' /> :
                     <p className="text-lg font-bold text-violet-400">{data?.completedCount}</p>
               }
            </div>
            <div className="bg-zinc-900/40 border border-white/5 rounded-xl p-3 text-center">
               <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold mb-1">Scheduled</p>
               {
                  isLoading ?
                     <span className='inline-flex h-5.5 w-5.5 rounded-md animate-pulse bg-zinc-700' /> :
                     <p className="text-lg font-bold text-violet-400">{data?.scheduledCount}</p>
               }
            </div>
            <div className="bg-zinc-900/40 border border-white/5 rounded-xl p-3 text-center">
               <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold mb-1">Success Rate</p>
               {
                  isLoading ?
                     <span className='inline-flex h-5.5 w-5.5 rounded-md animate-pulse bg-zinc-700' /> :
                     <p className="text-lg font-bold text-violet-400">{data?.successRate}%</p>
               }
            </div>
         </div>
      </PageHeaderLayout>
   );
};

export default AppointmentsHeader;