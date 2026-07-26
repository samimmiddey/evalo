import InterviwerCard from './interviewer-card';

const MOCK_INTERVIEWERS = [
   {
      id: '1',
      firstName: 'Sarah',
      lastName: 'Chen',
      designation: 'Senior Frontend Engineer',
      company: 'Vercel',
      experience: 8,
      expertise: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
      bio: 'Passionate about building fast, accessible web experiences. I specialize in modern React ecosystem and performance optimization.',
      imageUrl: 'https://i.pravatar.cc/150?u=sarah',
      rating: 4.9,
      reviews: 124
   },
   {
      id: '2',
      firstName: 'David',
      lastName: 'Kumar',
      designation: 'Staff Software Engineer',
      company: 'Stripe',
      experience: 12,
      expertise: ['System Design', 'Node.js', 'PostgreSQL', 'AWS'],
      bio: 'Backend specialist with a focus on scalable distributed systems and API design. Happy to help with architecture deep dives.',
      imageUrl: 'https://i.pravatar.cc/150?u=david',
      rating: 4.8,
      reviews: 89
   },
   {
      id: '3',
      firstName: 'Elena',
      lastName: 'Rodriguez',
      designation: 'Lead Product Designer',
      company: 'Figma',
      experience: 10,
      expertise: ['UI/UX', 'Design Systems', 'Prototyping'],
      bio: 'Bridging the gap between design and engineering. Let us talk about design systems, user research, and creating delightful interfaces.',
      imageUrl: 'https://i.pravatar.cc/150?u=elena',
      rating: 5.0,
      reviews: 210
   },
   {
      id: '4',
      firstName: 'James',
      lastName: 'Wilson',
      designation: 'Machine Learning Engineer',
      company: 'OpenAI',
      experience: 6,
      expertise: ['Python', 'PyTorch', 'LLMs', 'Data Science'],
      bio: 'Working at the intersection of product and AI. I can help you prepare for ML system design and algorithm rounds.',
      imageUrl: 'https://i.pravatar.cc/150?u=james',
      rating: 4.7,
      reviews: 56
   },
   {
      id: '5',
      firstName: 'Aisha',
      lastName: 'Patel',
      designation: 'Engineering Manager',
      company: 'Netflix',
      experience: 14,
      expertise: ['Leadership', 'System Design', 'Java', 'Microservices'],
      bio: 'Transitioning from IC to management? Let us chat. I also conduct behavioral and deep technical system design interviews.',
      imageUrl: 'https://i.pravatar.cc/150?u=aisha',
      rating: 4.9,
      reviews: 178
   },
   {
      id: '6',
      firstName: 'Marcus',
      lastName: 'Johnson',
      designation: 'Mobile Architect',
      company: 'Uber',
      experience: 9,
      expertise: ['iOS', 'Swift', 'React Native', 'Mobile Systems'],
      bio: 'Expert in scaling mobile applications and leading cross-platform migrations. Ask me anything about mobile architecture.',
      imageUrl: 'https://i.pravatar.cc/150?u=marcus',
      rating: 4.8,
      reviews: 92
   }
];

const InterviewerList = () => {
   return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {MOCK_INTERVIEWERS.map((interviewer) => (
            <InterviwerCard key={interviewer.id} interviewer={interviewer} />
         ))}
      </div>
   );
};

export default InterviewerList;