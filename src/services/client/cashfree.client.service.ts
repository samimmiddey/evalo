import { GET_PLANS } from "@/constants/query-urls";
import { api } from "@/lib/api";
import { apiError } from "@/lib/api-error";
import { PlansClientResponse, PlansResponse } from "@/types/cashfree.types";

// Fetch Subscription Plans
export const fetchPlans = async (): Promise<PlansResponse> => {
   try {
      const res = await api.get(GET_PLANS).json<PlansClientResponse>();

      if (!res.success) {
         throw new Error(res.error);
      }

      return res.data;
   } catch (error: unknown) {
      return apiError({
         error,
         fallbackMessage: "Failed to fetch subscription plans"
      });
   }
};