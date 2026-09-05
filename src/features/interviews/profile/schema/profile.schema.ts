import { z } from "zod";

const domainValues = [
   "FRONTEND",
   "BACKEND",
   "FULLSTACK",
   "DEVOPS",
   "DSA",
   "SYSTEM_DESIGN",
   "MOBILE",
   "ML_AI",
   "SECURITY",
   "QA",
   "CLOUD"
] as const;

// Update interviewer profile schema
export const updateInterviewerProfileSchema = z.object({
   designation: z.string().min(1, "Designation is required").max(100),
   company: z.string().min(1, "Company is required").max(100),
   experience: z.number().int().min(0, "Experience cannot be negative").max(50),
   expertise: z.array(z.enum(domainValues)).min(1, "Select at least one area of expertise"),
   bio: z.string().min(10, "Bio must be at least 10 characters").max(600, "Bio must be at most 600 characters")
});

export type UpdateInterviewerProfileSchemaTypes = z.infer<typeof updateInterviewerProfileSchema>;