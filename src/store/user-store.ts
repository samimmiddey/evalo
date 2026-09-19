import { getUser } from "@/services/client/user.client.service";
import { UserClient } from "@/types/user.types";
import { create } from "zustand";

interface User {
   user: UserClient | null;
   isLoading: boolean;
   error: string | null;
   fetchUser: () => Promise<void>;
}

const useUserStore = create<User>()(
   (set) => ({
      user: null,
      isLoading: false,
      error: null,
      fetchUser: async () => {
         set({ isLoading: true, error: null });
         try {
            const data = await getUser();
            set({ user: data, isLoading: false });
         } catch (error: unknown) {
            set({ error: error instanceof Error ? error.message : "Failed to fetch user", isLoading: false });
         }
      }
   })
);

export default useUserStore;