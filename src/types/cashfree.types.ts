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