import { usePlans } from "@clerk/nextjs/experimental";

export type Plan = NonNullable<ReturnType<typeof usePlans>['data']>[number];

export interface CustomPlan {
   id: string;
   name: string;
   amount: number;
   status: string;
   features: string[];
   description: string;
   credit: string;
   isPopular: boolean;
}