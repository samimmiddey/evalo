import z from "zod";

const role = ['INTERVIEWEE', 'INTERVIEWER'] as const;
const domainValue = ['FRONTEND', 'BACKEND', 'FULLSTACK', 'DEVOPS', 'DSA', 'SYSTEM_DESIGN', 'MOBILE', 'ML_AI', 'SECURITY', 'QA', 'CLOUD'] as const;

export const onboardingSchema = z.object({
   // Common fields
   role: z.enum(role, { error: 'Role is required' }),
   firstName: z.string()
      .min(1, 'First name is required')
      .min(3, 'First name must be at least 3 characters long')
      .max(50, 'First name must be at most 50 characters long'),
   lastName: z.string()
      .min(1, 'Last name is required')
      .min(3, 'Last name must be at least 3 characters long')
      .max(50, 'Last name must be at most 50 characters long'),

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