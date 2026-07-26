"use client";

import { DB_USER } from "@/config/query-urls";
import { api } from "@/lib/api";
import { apiError } from "@/lib/api-error";
import { UserClient, UserResponse } from "@/models/user.model";

export const getUser = async (): Promise<UserClient> => {
   try {
      const res = await api.get(DB_USER).json<UserResponse>();

      if (!res.success) {
         throw new Error(res.error);
      }

      return res.data;
   } catch (error: unknown) {
      return apiError(error, "Failed to fetch user");
   }
};