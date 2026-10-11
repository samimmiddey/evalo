import { PRO, STARTER } from "@/constants/cashfree";
import { apiCashfree } from "@/lib/api-cashfree";
import { ForbiddenError, UnauthorizedError, ValidationError } from "@/lib/app-error";
import { serverError } from "@/lib/server-error";
import { CashfreeError, CreateSubscriptionParams, CreateSubscriptionResponse, Plan, PlansResponse } from "@/types/cashfree.types";
import { currentUser } from "@clerk/nextjs/server";
import { checkUser } from "./user.server.service";

// Fetch Subscription Plans
export const fetchPlans = async (): Promise<PlansResponse> => {
   const user = await currentUser();

   // Check user authentication
   if (!user) {
      throw new UnauthorizedError("Unauthenticated user");
   }

   // Get plans
   try {
      const [starter, pro] = await Promise.all([
         apiCashfree.get(`/plans/${STARTER}`).json<Plan | CashfreeError>(),
         apiCashfree.get(`/plans/${PRO}`).json<Plan | CashfreeError>()
      ]);

      if ('code' in starter) {
         throw new ValidationError(starter.message);
      }

      if ('code' in pro) {
         throw new ValidationError(pro.message);
      }

      return {
         plans: [starter, pro]
      };
   } catch (error: unknown) {
      return serverError({
         error,
         fallbackMessage: "Failed to fetch subscription plans"
      });
   }
};

// Create a subscription
export const createSubscription = async (plan: CreateSubscriptionParams): Promise<CreateSubscriptionResponse> => {
   const user = await checkUser();

   // Check user authentication
   if (!user) {
      throw new UnauthorizedError("Unauthenticated user");
   }

   // Allow candidate to subscribe only
   if (user.role !== 'CANDIDATE') {
      throw new ForbiddenError("Only a candidate can subscribe to a plan");
   }

   // Check if the user is not on the same plan already
   if (user.currentPlan.toLowerCase().trim() === plan.name.toLowerCase().trim()) {
      throw new ForbiddenError("You are already on the selected plan");
   }

   try {
      const payload = {
         subscription_id: `sub_${user.id.slice(-8)}_${Date.now()}`,
         customer_details: {
            customer_name: `${user.firstName} ${user.lastName}`,
            customer_email: user.email,
            customer_phone: '9051461078'
         },
         plan_details: {
            plan_id: plan.id
         },
         authorization_details: {
            authorization_amount: 1,
            authorization_amount_refund: false,
            payment_methods: ['enach', 'upi', 'card']
         },
         subscription_meta: {
            return_url: 'http://localhost:3000/payment-success',
            notification_channel: ['EMAIL']
         }
      };

      const res = await apiCashfree.post('/subscriptions', { json: payload }).json<CreateSubscriptionResponse | CashfreeError>();

      if ('code' in res) {
         throw new ValidationError(res.message);
      }

      return res;
   } catch (error: unknown) {
      return serverError({
         error,
         fallbackMessage: "Failed to subscribe tot the plan"
      });
   }
};