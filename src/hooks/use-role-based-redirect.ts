import { useSession } from '@clerk/nextjs';
import { useRouter } from 'nextjs-toploader/app';

export const useRoleBasedRedirect = () => {
   const { session } = useSession();
   const router = useRouter();

   return async () => {
      await session?.reload();
      router.replace('/dashboard');
   };
};