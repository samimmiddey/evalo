import { ViewType } from '@/types/ui.types';
import InterviwerCard from './interviewer-card';
import { Interviewer } from '../../types/interviewee.type';

interface InterviewerListProps {
   view: ViewType;
   interviewers: Interviewer[];
   isLoading: boolean;
}

const InterviewerList = ({ view, interviewers, isLoading }: InterviewerListProps) => {
   return (
      <div className={`grid gap-5 2xl:gap-6 ${view === 'list' ? 'md:grid-cols-1' : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'}`}>
         {
            interviewers.map((interviewer) => (
               <InterviwerCard
                  key={interviewer.id}
                  interviewer={interviewer}
               />
            ))
         }
      </div>
   );
};

export default InterviewerList;