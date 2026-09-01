import { useSession } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export const useRoleBasedRedirect = () => {
   const { session } = useSession();
   const router = useRouter();

   return async () => {
      await session?.reload();
      router.replace('/dashboard');
   };
};