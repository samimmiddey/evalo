import type { Metadata } from 'next';

export const PAGE_METADATA = {
   home: {
      title: {
         absolute: 'Evalo - AI-Powered Mock Technical Interviews'
      },
      description:
         'Evaluate talent with clarity and confidence. Master technical interviews with vetted engineering professionals and AI feedback.'
   },
   about: {
      title: 'About Us',
      description:
         "Learn about Evalo's mission to bridge the gap between engineering talent and career opportunities through realistic mock interviews."
   },
   pricing: {
      title: 'Pricing & Credits',
      description:
         'Explore flexible credit packages and plans designed for booking mock technical interviews with industry professionals.'
   },
   contact: {
      title: 'Contact Us',
      description:
         'Have questions, feedback, or need assistance? Reach out to the Evalo team for support.'
   },
   ssoCallback: {
      title: 'Authenticating',
      description: 'Processing authentication and redirecting to your Evalo account.'
   },
   signIn: {
      title: 'Sign In',
      description:
         'Sign in to your Evalo account to manage mock interviews, availability, and session feedback.'
   },
   signUp: {
      title: 'Create Account',
      description:
         'Join Evalo today as a candidate or interviewer to start practicing or conducting technical interviews.'
   },
   forgotPassword: {
      title: 'Reset Password',
      description:
         'Reset your Evalo account password securely to regain access to your dashboard.'
   },
   onboarding: {
      title: 'Onboarding',
      description:
         'Complete your profile setup to tailor your mock interview experience on Evalo.'
   },
   dashboard: {
      title: 'Dashboard',
      description:
         'View your interview preparation stats, upcoming sessions, recent performance, and key metrics.'
   },
   interviewers: {
      title: 'Find Interviewers',
      description:
         'Browse vetted senior engineers and industry experts ready to conduct mock technical interviews.'
   },
   interviewerDetails: {
      title: 'Interviewer Profile',
      description:
         'View interviewer profile, professional background, expertise, and schedule a mock technical interview.'
   },
   appointments: {
      title: 'My Appointments',
      description:
         'Track and manage all your scheduled, completed, and upcoming mock interview appointments.'
   },
   sessions: {
      title: 'Interview Sessions',
      description:
         'View and manage your mock interview sessions, track booking statuses, candidate feedback, and session history.'
   },
   availability: {
      title: 'Manage Availability',
      description:
         'Configure your weekly recurring schedule and open time slots to conduct mock technical interviews.'
   },
   payouts: {
      title: 'Earnings & Payouts',
      description:
         'Track your interview earnings, view credit balances, and submit payout requests.'
   },
   profile: {
      title: 'Profile Settings',
      description:
         'Update your professional bio, technical domains, experience level, and hourly credit rate.'
   },
   call: {
      title: 'Live Interview Call',
      description:
         'Join your scheduled live technical interview session with real-time video, coding chat, and AI assistance.'
   },
} as const satisfies Record<string, Metadata>;
