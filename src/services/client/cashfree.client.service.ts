import { CREATE_SUBSCRIPTION, GET_PLANS } from "@/constants/query-urls";
import { api } from "@/lib/api";
import { apiError } from "@/lib/api-error";
import { CreateSubscriptionClientResponse, CreateSubscriptionParams, CreateSubscriptionResponse, PlansClientResponse, PlansResponse } from "@/types/cashfree.types";

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

// Create Subscription
export const createSubscription = async (params: CreateSubscriptionParams): Promise<CreateSubscriptionResponse> => {
   try {
      const res = await api.post(CREATE_SUBSCRIPTION, { json: params }).json<CreateSubscriptionClientResponse>();

      if (!res.success) {
         throw new Error(res.error);
      }

      return res.data;
   } catch (error: unknown) {
      return apiError({
         error,
         fallbackMessage: "Failed to subscribe tot the plan"
      });
   }
};