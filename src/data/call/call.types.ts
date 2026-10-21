import { InterviewExpertise } from "@/generated/prisma/enums";

export type ExpertisePrompts = Record<InterviewExpertise, string>;

export interface CallDataStatic {
   expertisePrompts: ExpertisePrompts;
}

export type CallData = CallDataStatic;
