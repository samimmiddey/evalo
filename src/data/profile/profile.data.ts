import { ProfileDataStatic } from "./profile.types";

export const profileData: ProfileDataStatic = {
   header: {
      title: "Profile Settings",
      description: "Update your bio, current company, designation, years of experience, and interview domains."
   },
   formCard: {
      title: "Interviewer Profile & Session Rates",
      description: "Customize how your profile appears to candidates and configure your booking rate."
   },
   fields: {
      designation: {
         label: "Designation / Role Title",
         placeholder: "e.g. Senior Frontend Engineer"
      },
      company: {
         label: "Current Company",
         placeholder: "e.g. Google, Stripe, Microsoft"
      },
      experience: {
         label: "Years of Industry Experience"
      },
      expertise: {
         label: "Interview Domains & Technical Expertise",
         placeholder: "Select expertise domains..."
      },
      bio: {
         label: "About Me & Interview Style",
         placeholder: "Describe your background, what candidates can expect in your sessions, and your technical focus areas..."
      }
   },
   submitButton: "Save Changes"
};
