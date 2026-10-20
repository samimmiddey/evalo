import { SubscriptionStatus } from "@/generated/prisma/enums";
import { BaseResponse } from "./api.types";

export interface Plan {
   plan_currency: string;
   plan_id: string;
   plan_interval_type: string;
   plan_intervals: number;
   plan_max_amount: number;
   plan_max_cycles: number;
   plan_name: string;
   plan_note: string;
   plan_recurring_amount: number;
   plan_status: string;
   plan_type: string;
}

export interface PlansResponse {
   plans: Plan[];
}

export interface CashfreeError {
   message: string;
   code: string;
   type: string;
}

export type PlansClientResponse = BaseResponse<PlansResponse>;

export interface CreateSubscriptionParams {
   id: string;
   name: string;
}

export interface CreateSubscriptionResponse {
   subscription_session_id: string;
}

export type CreateSubscriptionClientResponse = BaseResponse<CreateSubscriptionResponse>;

export interface CashfreeSubscriptionWebhookPayload {
   type: string;
   event_time?: string;
   data: {
      subscription_id?: string;
      cf_subscription_id?: string;
      subscription_status?: string;
      subscription_details?: {
         subscription_id: string;
         subscription_status: string;
         cf_subscription_id?: string;
         current_cycle?: number;
      };
      customer_details?: {
         customer_email?: string;
         customer_name?: string | null;
         customer_phone?: string | null;
      };
      plan_details?: {
         plan_id?: string;
         plan_name?: string;
         plan_type?: string;
      };
      payment_id?: string;
      cf_payment_id?: string;
      payment_status?: string;
      payment_type?: string;
      payment_amount?: number;
      payment_time?: string;
      payment_details?: {
         payment_id?: string;
         payment_status?: string;
         payment_amount?: number;
         payment_time?: string;
      };
   };
}

export interface SubscriptionResponse {
   subscription_status: SubscriptionStatus;
   subscription_id: string;
}

export type SubscriptionClientResponse = BaseResponse<SubscriptionResponse>;