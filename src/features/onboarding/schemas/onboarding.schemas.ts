import z from "zod";

export const onboardingSchema = z.object({
   // Common fields
   role: z.enum(['interviewee', 'interviewer'], { error: 'Role is required' }),
   name: z.string()
      .min(1, 'Full name is required')
      .min(3, 'Full name must be at least 3 characters long'),

   // Interviewer only fields
   designation: z.string().optional(),
   company: z.string().optional(),
   yoe: z.string().optional(),
   expertise: z.string().optional(),
   about: z.string().optional()
}).superRefine((data, ctx) => {
   if (data.role === 'interviewer') {
      const requiredFields: { key: 'designation' | 'company' | 'yoe' | 'expertise' | 'about', message: string; }[] = [
         { key: 'designation', message: 'Designation is required' },
         { key: 'company', message: 'Company is required' },
         { key: 'yoe', message: 'Years of experience is required' },
         { key: 'expertise', message: 'Expertise is required' },
         { key: 'about', message: 'About is required' },
      ];

      requiredFields.forEach(({ key, message }) => {
         if (!data[key]) {
            ctx.addIssue({
               code: 'custom',
               message,
               path: [key]
            });
         }
      });

      if (data?.about && data.about.length > 500) {
         ctx.addIssue({
            code: 'custom',
            message: 'About must be at most 500 characters long',
            path: ['about']
         });
      }
   }
});

// Onboarding Form Data Types
export type OnboardingSchemaTypes = z.infer<typeof onboardingSchema>;