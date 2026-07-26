import z from "zod";

const role = ['INTERVIEWEE', 'INTERVIEWER'] as const;
const domainValue = ['FRONTEND', 'BACKEND', 'FULLSTACK', 'DEVOPS', 'DSA', 'SYSTEM_DESIGN', 'MOBILE', 'ML_AI', 'SECURITY', 'QA', 'CLOUD'] as const;

export const onboardingSchema = z.object({
   // Common fields
   role: z.enum(role, { error: 'Role is required' }),
   name: z.string()
      .min(1, 'Full name is required')
      .min(3, 'Full name must be at least 3 characters long'),

   // Interviewer only fields
   designation: z.string().optional(),
   company: z.string().optional(),
   experience: z.string().optional(),
   expertise: z.array(z.enum(domainValue)).optional(),
   bio: z.string().optional()
}).superRefine((data, ctx) => {
   if (data.role === 'INTERVIEWER') {
      const requiredFields: { key: 'designation' | 'company' | 'experience' | 'expertise' | 'bio', message: string; }[] = [
         { key: 'designation', message: 'Designation is required' },
         { key: 'company', message: 'Company is required' },
         { key: 'experience', message: 'Years of experience is required' },
         { key: 'expertise', message: 'Expertise is required' },
         { key: 'bio', message: 'About is required' },
      ];

      requiredFields.forEach(({ key, message }) => {
         if (!data[key] || (Array.isArray(data[key]) && (data[key] as unknown[]).length === 0)) {
            ctx.addIssue({
               code: 'custom',
               message,
               path: [key]
            });
         }
      });

      if (data?.bio && data.bio.length > 500) {
         ctx.addIssue({
            code: 'custom',
            message: 'Bio must be at most 500 characters long',
            path: ['bio']
         });
      }

      if (!data.experience || data.experience === 'null') {
         ctx.addIssue({
            code: 'custom',
            message: 'Years of experience is required',
            path: ['experience'],
         });
      }
   }
});

// Onboarding Form Data Types
export type OnboardingSchemaTypes = z.infer<typeof onboardingSchema>;