"use client";

import useUserStore from "@/store/user-store";
import { useEffect } from "react";

export const useAppUser = () => {
   const { user, isLoading, error, fetchUser } = useUserStore();

   useEffect(() => {
      if (!user) {
         void fetchUser();
      }
   }, [user, fetchUser]);

   return { user, isLoading, error, refetch: fetchUser };
};