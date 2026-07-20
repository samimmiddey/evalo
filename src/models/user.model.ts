import { BaseResponse } from "./api.model";

export interface User {
   id: string;
   clerkUserId: string;
   email: string;
   name: string;
   imageUrl: string;
   role: string;
   createdAt: string;
   updatedAt: string;
   credits: number;
   currentPlan: string;
   creditsLastAllocatedAt: string;
   lastProcessedPeriodStart: string;
   bio: string | null;
   title: string | null;
   company: string | null;
   yearsExp: number | null;
   categories: string[];
   creditRate: number;
   creditBalance: number;
}

export type UserResponse = BaseResponse<User>;