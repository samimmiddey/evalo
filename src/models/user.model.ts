import { BaseResponse } from "./api.model";

export type UserRole = 'INTERVIEWEE' | 'INTERVIEWER' | 'UNASSIGNED';
export type AssignedRole = Exclude<UserRole, 'UNASSIGNED'>;

export interface UserServer {
   id: string;
   clerkUserId: string;
   email: string;
   firstName: string | null;
   lastName: string | null;
   imageUrl: string | null;
   role: UserRole;
   createdAt: Date;
   updatedAt: Date;
   credits: number;
   currentPlan: string;
   creditsLastAllocatedAt: Date | null;
   lastProcessedPeriodStart: Date | null;
   bio: string | null;
   designation: string | null;
   company: string | null;
   experience: number | null;
   expertise: string[];
   creditRate: number;
   creditBalance: number;
}

export type UserClient = Omit<
   UserServer,
   'createdAt' | 'updatedAt' | 'creditsLastAllocatedAt' | 'lastProcessedPeriodStart'
> & {
   createdAt: string;
   updatedAt: string;
   creditsLastAllocatedAt: string | null;
   lastProcessedPeriodStart: string | null;
};

export type UserResponse = BaseResponse<UserClient>;