export interface Appointment {
   id: string;
   interviewer: {
      firstName: string;
      lastName: string;
      imageUrl: string;
      designation: string;
      company: string;
      experience: number;
      expertise: string[];
      rating: number;
      reviewsCount: number;
   };
   status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
   date: string;
   timeSlot: string;
   duration: string;
   aiFeedback?: {
      summary: string;
      overallScore: number;
      performanceLevel: 'Outstanding' | 'Excellent' | 'Proficient' | 'Needs Improvement';
      metrics: {
         technical: number;
         communication: number;
         problemSolving: number;
      };
   };
}

export interface HelpfulTips {
   header: string;
   body: string;
}

export interface AppointmentsHeaderData {
   title: string;
   body: string;
   stats: {
      title: string;
      value: string;
   }[];
}

export interface AppointmentsData {
   header: AppointmentsHeaderData;
   appointments: Appointment[];
   helpfulTips: HelpfulTips;
}