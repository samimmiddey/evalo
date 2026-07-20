"use client";

import { api } from "@/lib/api";
import { apiError } from "@/lib/api-error";
import { User, UserResponse } from "@/models/user.model";

export const getUser = async (): Promise<User> => {
   try {
      const res = await api.get('user').json<UserResponse>();

      if (!res.success) {
         throw new Error(res.error);
      }

      return res.data;
   } catch (error: unknown) {
      return apiError(error, "Failed to fetch user");
   }
};