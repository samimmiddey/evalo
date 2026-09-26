import type { Metadata } from 'next';
import { PAGE_METADATA } from '@/constants/metadata';
import InterviewerListing from '@/features/interviews/interviewer-list/interviewer-listing';

export const metadata: Metadata = PAGE_METADATA.interviewers;

const InterviewerPage = () => {
   return (
      <InterviewerListing />
   );
};

export default InterviewerPage;