import ScreenError from '@/components/common/screen-error';
import CallRoom from '@/features/interviews/call/call-room';
import { getCallData } from '@/features/interviews/call/services/call.server.service';
import { CallData } from '@/features/interviews/call/types/call.types';

const CallPage = async ({ params }: { params: Promise<{ id: string; }>; }) => {
   const { id } = await params;

   let callData: CallData;

   try {
      callData = await getCallData(id);
   } catch (error: unknown) {
      return <ScreenError text={error instanceof Error ? error.message : 'Failed to fetch call data'} />;
   }

   return (
      <CallRoom
         callData={callData}
         callId={id}
      />
   );
};

export default CallPage;