"use client";

import useUserStore from "@/store/user-store";
import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";

export const useAppUser = () => {
   const { isLoaded, isSignedIn, user: clerkUser } = useUser();
   const { user, isLoading, error, fetchUser, clearUser } = useUserStore();

   const clerkUserId = clerkUser?.id;
   const isMismatch = Boolean(isLoaded && isSignedIn && clerkUserId && user && user.clerkUserId !== clerkUserId);

   useEffect(() => {
      if (!isLoaded) return;

      // Logged out: wipe store immediately
      if (!isSignedIn || !clerkUser) {
         if (user) clearUser();
         return;
      }

      // Switched accounts: clear previous user and fetch the new one
      if (user && user.clerkUserId !== clerkUserId) {
         clearUser();
         void fetchUser();
         return;
      }

      // Initial fetch: guard against loading and error to prevent infinite loops
      if (!user && !isLoading && !error) {
         void fetchUser();
      }
   }, [user, clerkUserId, fetchUser, isLoaded, isSignedIn, clerkUser, clearUser, error, isLoading]);

   const effectiveUser = isMismatch ? null : user;
   const effectiveLoading = !isLoaded || isLoading || isMismatch;

   return {
      user: effectiveUser,
      isLoading: effectiveLoading,
      error,
      refetch: fetchUser
   };
};