import ScreenError from '@/components/common/screen-error';
import { InterviewerDetails as TInterviewerDetails } from '@/features/explore/details/types/details.types';
import InterviewerDetails from '@/features/explore/details/interviewer-details';
import { getInterviewerDetails } from '@/features/explore/details/services/details.server.service';

const InterviewerDetailsPage = async ({ params }: { params: Promise<{ id: string; }>; }) => {
   const { id } = await params;
   let interviewer: TInterviewerDetails;

   try {
      interviewer = await getInterviewerDetails(id);
   } catch (error: unknown) {
      return <ScreenError text={error instanceof Error ? error.message : 'Failed to fetch interviewer details'} />;
   }

   return (
      <InterviewerDetails interviewer={interviewer} />
   );
};

export default InterviewerDetailsPage;