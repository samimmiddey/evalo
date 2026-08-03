import { ArrowLeft, BookCheck, Brain, MessageSquare, User } from "lucide-react";
import { ExploreData, InterviewerDetails } from "./explore.types";

export const exploreData: ExploreData = {
   header: {
      title: "Find your perfect interviewer",
      description: "Connect with industry experts from top companies for mock interviews, career guidance, and technical mentorship."
   },
   expertise: [
      {
         label: "Frontend",
         value: "FRONTEND"
      },
      {
         label: "Backend",
         value: "BACKEND"
      },
      {
         label: "FullStack",
         value: "FULLSTACK"
      },
      {
         label: "DevOps",
         value: "DEVOPS"
      },
      {
         label: "DSA",
         value: "DSA"
      },
      {
         label: "System Design",
         value: "SYSTEM_DESIGN"
      },
      {
         label: "Mobile",
         value: "MOBILE"
      },
      {
         label: "Machine Learning",
         value: "ML_AI"
      },
      {
         label: "Security",
         value: "SECURITY"
      },
      {
         label: "QA",
         value: "QA"
      },
      {
         label: "Cloud",
         value: "CLOUD"
      }
   ],
   experience: [
      {
         label: 'Entry Level (0-2 yrs)',
         value: '0-2'
      },
      {
         label: 'Mid Level (3-5 yrs)',
         value: '3-5'
      },
      {
         label: 'Senior (6-9 yrs)',
         value: '6-9'
      },
      {
         label: 'Staff+ (10+ yrs)',
         value: '10+'
      }
   ]
};

export const interviewerDetailsData: InterviewerDetails = {
   backBtn: {
      title: "Back to Explore",
      icon: ArrowLeft
   },
   creditRate: 1,
   bio: {
      title: "About Me",
      icon: User
   },
   testimonial: {
      title: "Candidate Reviews",
      icon: MessageSquare
   },
   booking: {
      title: "Book a Session",
      icon: BookCheck
   },
   whatToExpect: {
      header: {
         title: 'What to expect',
         icon: Brain,
      }
   },
   interviewers: [
      {
         id: "int_1",
         firstName: "Sarah",
         lastName: "Chen",
         imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200",
         designation: "Staff Software Engineer",
         company: "Google",
         experience: 8,
         bio: "Sarah is a staff front-end architect at Google with 8+ years of experience. She specializes in large-scale React systems, performance tuning, and technical system design interviews.",
         expertise: ["FRONTEND", "FULLSTACK", "SYSTEM_DESIGN"],
         averageRating: 4.9,
         totalRatings: 142,
         availabilities: [
            { startTime: "2026-08-10T09:00:00Z", endTime: "2026-08-10T10:00:00Z" },
            { startTime: "2026-08-10T11:00:00Z", endTime: "2026-08-10T12:00:00Z" },
            { startTime: "2026-08-11T14:00:00Z", endTime: "2026-08-11T15:00:00Z" },
            { startTime: "2026-08-11T16:00:00Z", endTime: "2026-08-11T17:00:00Z" },
            { startTime: "2026-08-12T10:00:00Z", endTime: "2026-08-12T11:00:00Z" },
         ],
         testimonials: [
            {
               id: "t1",
               authorName: "Marcus Aurelius",
               role: "Frontend Engineer @ Stripe",
               rating: 5,
               comment: "Sarah's mock interview was extremely realistic. Her feedback on component design and state management helped me land my offer at Stripe!",
               date: "2 weeks ago"
            },
            {
               id: "t2",
               authorName: "Elena Rostova",
               role: "Software Engineer",
               rating: 5,
               comment: "Super detailed comments on Javascript performance and rendering cycles. Highly recommended if you want to push for a senior role.",
               date: "1 month ago"
            }
         ]
      },
      {
         id: "int_2",
         firstName: "David",
         lastName: "Kovacs",
         imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200",
         designation: "Senior Backend Architect",
         company: "Netflix",
         experience: 10,
         bio: "David leads cloud platform initiatives at Netflix. He has extensive expertise in distributed systems, microservices design, and Go/Java scaling patterns.",
         expertise: ["BACKEND", "SYSTEM_DESIGN", "CLOUD"],
         averageRating: 4.8,
         totalRatings: 98,
         availabilities: [
            { startTime: "2026-08-10T10:00:00Z", endTime: "2026-08-10T11:00:00Z" },
            { startTime: "2026-08-10T15:00:00Z", endTime: "2026-08-10T16:00:00Z" },
            { startTime: "2026-08-12T13:00:00Z", endTime: "2026-08-12T14:00:00Z" },
            { startTime: "2026-08-13T09:00:00Z", endTime: "2026-08-13T10:00:00Z" },
         ],
         testimonials: [
            {
               id: "t3",
               authorName: "Julianne V.",
               role: "Backend Dev",
               rating: 5,
               comment: "Amazing feedback on system scalability. He pointed out single points of failure in my architecture that I hadn't even considered.",
               date: "3 days ago"
            }
         ],
      },
      {
         id: "int_3",
         firstName: "Sophia",
         lastName: "Bennett",
         imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200",
         designation: "Engineering Lead",
         company: "Microsoft",
         experience: 12,
         bio: "Aisha is a dev lead at Microsoft who loves helping engineers prep for technical interviews. She has deep expertise in DSA, Full Stack systems, and leadership coaching.",
         expertise: ["FULLSTACK", "DSA", "DEVOPS"],
         averageRating: 5.0,
         totalRatings: 184,
         availabilities: [
            { startTime: "2026-08-11T09:00:00Z", endTime: "2026-08-11T10:00:00Z" },
            { startTime: "2026-08-11T10:30:00Z", endTime: "2026-08-11T11:30:00Z" },
            { startTime: "2026-08-13T16:00:00Z", endTime: "2026-08-13T17:00:00Z" },
         ],
         testimonials: [
            {
               id: "t4",
               authorName: "Kofi A.",
               role: "Software Dev II",
               rating: 5,
               comment: "Aisha's behavioral advice was just as valuable as her technical advice. She really knows what hiring managers look for in top-tier candidates.",
               date: "1 month ago"
            }
         ]
      }
   ]
};