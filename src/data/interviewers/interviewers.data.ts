import { ArrowLeft, BookCheck, Brain, MessageSquare, User } from "lucide-react";
import { InterviewersDataStatic } from "./interviewers.types";

export const interviewersData: InterviewersDataStatic = {
   header: {
      title: "Explore interviewers",
      description: "Connect with industry experts from top companies for mock interviews, career guidance, and technical mentorship."
   },
   search: {
      placeholder: "Search interviewers..."
   },
   filters: {
      title: "Filters",
      clearButton: "Clear",
      applyButton: "Apply",
      clearTooltip: "Clear Filters",
      expertiseTitle: "Expertise",
      experienceTitle: "Experience"
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
         label: "Entry Level (0-2 yrs)",
         value: "0-2"
      },
      {
         label: "Mid Level (3-5 yrs)",
         value: "3-5"
      },
      {
         label: "Senior (6-9 yrs)",
         value: "6-9"
      },
      {
         label: "Staff+ (10+ yrs)",
         value: "10+"
      }
   ],
   card: {
      viewProfileButton: "View Profile",
      fallbackBio: "No bio available"
   },
   noData: {
      title: "No interviewers found",
      body: "We couldn't find any interviewers matching your filters. Try adjusting your search criteria or filters."
   },
   details: {
      backBtn: {
         title: "Back to Interviewers",
         icon: ArrowLeft
      },
      scheduleButton: "Schedule Interview",
      creditRate: 1,
      bio: {
         title: "About Me",
         icon: User
      },
      whatToExpect: {
         title: "What to Expect",
         icon: Brain
      },
      testimonial: {
         title: "Candidate Reviews",
         icon: MessageSquare,
         noFeedbackText: "No user feedback available"
      },
      booking: {
         title: "Book a Session",
         icon: BookCheck
      },
      appointmentModal: {
         title: "Appointment Form",
         description: "Choose your preferred date and time to reserve your interview."
      },
      noSlotsText: "No available slots",
      noInterviewerText: "No interviewer found"
   }
};

export const interviewerDetailsData = interviewersData.details;
