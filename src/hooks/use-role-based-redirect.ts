import { useSession } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export const useRoleBasedRedirect = () => {
   const { session } = useSession();
   const router = useRouter();

   return async () => {
      await session?.reload();
      const role = session?.user?.publicMetadata?.role;
      router.replace(role === 'INTERVIEWER' ? '/dashboard' : '/explore');
   };
};