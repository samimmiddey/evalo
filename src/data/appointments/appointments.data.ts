import { AppointmentsData } from "./appointments.types";

export const appointsData: AppointmentsData = {
   header: {
      title: 'Appointments',
      body: 'Manage your upcoming mock interviews, access session rooms, and review AI-powered evaluation summaries.',
      stats: [
         {
            title: 'scheduled',
            value: '2',
         },
         {
            title: 'Completed',
            value: '2',
         },
         {
            title: 'Success Rate',
            value: '100%',
         }
      ]
   },
   appointments: [
      {
         id: 'appt-1',
         interviewer: {
            firstName: 'Samim',
            lastName: 'Middey',
            imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop',
            designation: 'Frontend Architect',
            company: 'Broadifi Technologies',
            experience: 5,
            expertise: ['Frontend', 'System Design', 'React'],
            rating: 4.9,
            reviewsCount: 142
         },
         status: 'completed',
         date: 'Aug 12, 2026',
         timeSlot: '10:00 AM - 11:00 AM',
         duration: '60 min',
         aiFeedback: {
            summary: 'Strong technical understanding with good problem-solving ability. Communication was clear and structured, although the candidate could improve the depth of system-design explanations.',
            overallScore: 87,
            performanceLevel: 'Excellent',
            metrics: {
               technical: 90,
               communication: 85,
               problemSolving: 86
            }
         }
      },
      {
         id: 'appt-2',
         interviewer: {
            firstName: 'Sarah',
            lastName: 'Jenkins',
            imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&auto=format&fit=crop',
            designation: 'Senior Backend Engineer',
            company: 'Vercel',
            experience: 8,
            expertise: ['Node.js', 'PostgreSQL', 'System Design', 'Caching'],
            rating: 5.0,
            reviewsCount: 98
         },
         status: 'scheduled',
         date: 'Aug 15, 2026',
         timeSlot: '02:00 PM - 03:00 PM',
         duration: '60 min'
      },
      {
         id: 'appt-3',
         interviewer: {
            firstName: 'Alex',
            lastName: 'Rivera',
            imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&auto=format&fit=crop',
            designation: 'Staff Software Engineer',
            company: 'Google',
            experience: 10,
            expertise: ['Algorithms', 'Go', 'Distributed Systems', 'K8s'],
            rating: 4.8,
            reviewsCount: 210
         },
         status: 'in-progress',
         date: 'Aug 09, 2026',
         timeSlot: '12:00 PM - 01:00 PM',
         duration: '60 min'
      },
      {
         id: 'appt-4',
         interviewer: {
            firstName: 'Emily',
            lastName: 'Chen',
            imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=256&auto=format&fit=crop',
            designation: 'Engineering Manager',
            company: 'Stripe',
            experience: 12,
            expertise: ['System Design', 'Leadership', 'Architecture'],
            rating: 4.9,
            reviewsCount: 325
         },
         status: 'completed',
         date: 'Aug 05, 2026',
         timeSlot: '04:00 PM - 05:00 PM',
         duration: '60 min',
         aiFeedback: {
            summary: 'Demonstrated exceptional engineering leadership and architectural planning. Excelled at scaling strategies. Minor adjustments suggested for concrete database choice justifications under heavy write loads.',
            overallScore: 94,
            performanceLevel: 'Outstanding',
            metrics: {
               technical: 95,
               communication: 96,
               problemSolving: 91
            }
         }
      },
      {
         id: 'appt-5',
         interviewer: {
            firstName: 'David',
            lastName: 'Kim',
            imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=256&auto=format&fit=crop',
            designation: 'Fullstack Engineer',
            company: 'Meta',
            experience: 6,
            expertise: ['React', 'GraphQL', 'Product Engineering'],
            rating: 4.7,
            reviewsCount: 74
         },
         status: 'cancelled',
         date: 'Jul 28, 2026',
         timeSlot: '09:00 AM - 10:00 AM',
         duration: '60 min'
      }
   ],
   helpfulTips: {
      header: "Preparation Guidelines",
      body: "All mock interviews are conducted using Evalo's integrated room with compiler and collaborative audio/video features. Make sure to join the session at least 5 minutes early to test your audio, video, and connection. AI feedback reports are generated within 10 minutes of completing a session."
   }
};