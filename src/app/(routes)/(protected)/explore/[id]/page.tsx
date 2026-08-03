import ScreenError from '@/components/common/screen-error';
import { InterviewerFeedback, InterviewerDetails as TInterviewerDetails } from '@/features/explore/details/types/details.types';
import InterviewerDetails from '@/features/explore/details/interviewer-details';
import { getFeedback, getInterviewerDetails } from '@/features/explore/details/services/details.server.service';

const InterviewerDetailsPage = async ({ params }: { params: Promise<{ id: string; }>; }) => {
   const { id } = await params;
   let interviewer: TInterviewerDetails;
   let feedback: InterviewerFeedback;

   try {
      [interviewer, feedback] = await Promise.all([getInterviewerDetails(id), getFeedback(id)]);
   } catch (error: unknown) {
      return <ScreenError text={error instanceof Error ? error.message : 'Failed to fetch interviewer details'} />;
   }

   return (
      <InterviewerDetails
         interviewer={interviewer}
         feedback={feedback}
      />
   );
};

export default InterviewerDetailsPage;