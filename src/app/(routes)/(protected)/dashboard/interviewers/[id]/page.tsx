import type { Metadata } from 'next';
import { PAGE_METADATA } from '@/constants/metadata';
import ScreenError from '@/components/common/screen-error';
import { InterviewerDetails as TInterviewerDetails } from '@/features/interviews/interviewer-details/types/details.types';
import InterviewerDetails from '@/features/interviews/interviewer-details/interviewer-details';
import { getInterviewerDetails } from '@/features/interviews/interviewer-details/services/details.server.service';

export const metadata: Metadata = PAGE_METADATA.interviewerDetails;

const InterviewerDetailsPage = async ({ params }: { params: Promise<{ id: string; }>; }) => {
   const { id } = await params;
   let interviewer: TInterviewerDetails;

   try {
      interviewer = await getInterviewerDetails(id);
   } catch (error: unknown) {
      return <ScreenError text={error instanceof Error ? error.message : 'Failed to fetch interviewer details'} />;
   }

   return (
      <InterviewerDetails
         interviewer={interviewer}
         id={id}
      />
   );
};

export default InterviewerDetailsPage;