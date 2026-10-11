import { GET_PLATFORM_CONFIG } from "@/constants/query-urls";
import { api } from "@/lib/api";
import { apiError } from "@/lib/api-error";
import { Config, ConfigResponse } from "@/types/global.types";

// Get Platform Config Data
export const getPlatformConfig = async (): Promise<Config> => {
   try {
      const res = await api.get(GET_PLATFORM_CONFIG).json<ConfigResponse>();

      if (!res.success) {
         throw new Error(res.error);
      }

      return res.data;
   } catch (error: unknown) {
      return apiError({
         error,
         fallbackMessage: "Failed to load platform config"
      });
   }
};