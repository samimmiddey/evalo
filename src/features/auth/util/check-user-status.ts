import { toast } from "sonner";
import { checkAccountStatus } from "../services/auth.client.service";

export const checkUserStatus = async (email: string): Promise<boolean> => {
   if (!email) return false;

   try {
      const { isBanned, isAdmin } = await checkAccountStatus(email);

      if (isAdmin) {
         toast.error("You are not allowed to perform this action.");
         return true;
      }

      if (isBanned) {
         toast.error("Your account has been suspended. Please contact support.");
         return true;
      }
      return false;
   } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to verify account status");
      return true;
   }
};

