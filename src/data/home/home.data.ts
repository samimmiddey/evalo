import { HomeDataTypes } from "./home.types";
import { Video, BrainCircuit, Library, LineChart, CalendarClock, Zap, Shuffle, CreditCard, MessageSquareQuote } from 'lucide-react'

export const homeData: HomeDataTypes = {
   hero: {
      header: "Go beyond the surface to evaluate true potential",
      title: "Ace your next interview with real experts",
      description: "Get matched with experts for one-on-one mock interviews that go beyond generic advice. Receive personalized feedback and gain the confidence you need to succeed."
   },
   features: {
      icon: Zap,
      header: "Built for Excellence",
      title: "Everything You Need to Succeed",
      description: "Practice and complete interviews easily with structured assessments, clear instructions, and real-time feedback designed to help you improve.",
      cards: [
         {
            icon: Video,
            title: "Live Interview Sessions & Persistent Chat",
            description:
               "Connect with interviewers through smooth HD video calls and persistent chat that keeps your entire conversation history, shared context, and discussion flow in one place, making it easy to revisit decisions, clarify doubts, and stay aligned throughout the interview process.",
         },
         {
            icon: BrainCircuit,
            title: "AI-Assisted Performance Evaluation",
            description:
               "Receive instant, objective feedback on your solutions with insights on code quality, complexity, and adherence to best practices to help you improve faster.",
         },
         {
            icon: Library,
            title: "Flexible Credit-Based Access",
            description:
               "Subscribe to monthly credits, book interview sessions instantly, and manage usage easily while interviewers can earn credits and withdraw their earnings anytime.",
         },
         {
            icon: LineChart,
            title: "Detailed Performance Reports",
            description:
               "Track your progress over time with in-depth analytics that highlight strengths, weaknesses, and actionable areas for improvement.",
         },
         {
            icon: CalendarClock,
            title: "Slot-Based Scheduling",
            description:
               "Easily book and manage interview sessions using flexible time slots, allowing candidates and interviewers to coordinate availability seamlessly without conflicts.",
         }
      ]
   },
   roles: {
      icon: Shuffle,
      header: "Two Sides. One Platform.",
      title: "Where Talent Meets Opportunity",
      description: "Where talent meets real opportunity through structured interviews, skill-based assessments, and meaningful evaluation that helps candidates grow and get discovered.",
      interviewee: {
         title: "Land the role you deserve",
         description:
            "Practice real interview scenarios, sharpen your problem-solving skills, and get evaluated through structured assessments designed to reflect actual hiring standards. Build confidence and improve continuously with every attempt.",
         points: [
            "Solve real-world coding and system design problems",
            "Get instant AI-driven performance feedback",
            "Track progress with detailed skill insights",
            "Practice in a real interview-like environment",
            "Improve with every attempt you take",
         ],
      },

      interviewer: {
         title: "Put Your Expertise to Work",
         description:
            "Conduct interviews on your own schedule, evaluate candidates efficiently, and earn credits for every session you complete. Share your expertise while helping others grow in their careers and achieve their professional goals.",
         points: [
            "Conduct structured technical interviews remotely",
            "Evaluate candidates using guided assessment flows",
            "Earn credits for every completed session",
            "Withdraw earnings anytime with ease",
            "Build reputation as a trusted interviewer",
         ],
      },
   },
   pricing: {
      icon: CreditCard,
      header: "Simple, Transparent Pricing",
      title: "Invest in Your Career Growth",
      description: "Choose the plan that fits your needs. Whether you're just starting out or preparing for top-tier tech interviews, we have you covered.",
      plans: [
         {
            title: "Free",
            price: "$0",
            description: "Perfect for getting started and exploring the platform.",
            credit: "1 credit per month",
            features: [
               "1 mock interview session",
               "HD video call via Stream",
               "Persistent chat thread",
            ],
            isPopular: false
         },
         {
            title: "Starter",
            price: "$29",
            description: "Ideal for focused preparation and consistent practice.",
            credit: "5 credits per month",
            features: [
               "5 mock interviews per month",
               "AI feedback report",
               "HD video call via stream",
               "Persistent chat thread",
               "Credits roll over monthly"
            ],
            isPopular: true
         },
         {
            title: "Pro",
            price: "$79",
            description: "For serious candidates aiming for top tech companies.",
            credit: "15 credits per month",
            features: [
               "15 mock interview sessions",
               "AI feedback report",
               "HD video call via stream",
               "Persistent chat thread",
               "Credits roll over monthly",
               "Recording and playback link"
            ],
            isPopular: false
         }
      ]
   },
   testimonials: {
      icon: MessageSquareQuote,
      header: "Success Stories",
      title: "Loved by Candidates and Experts",
      description: "See how Evalo is helping candidates land their dream jobs and experts monetize their interview skills.",
      reviews: [
         {
            name: "Sarah Chen",
            role: "Software Engineer at Google",
            review: "Evalo's mock interviews completely changed my prep strategy. The AI feedback on my answers was incredibly detailed, and the overall insights have helped me improve in key areas immensely.",
            avatar: "S",
         },
         {
            name: "James Rodriguez",
            role: "Frontend Developer",
            review: "I was struggling with behavioral questions and react-specific system design. The platform paired me with a Senior Frontend Engineer who gave me the exact insights I needed to pass my final rounds at Meta.",
            avatar: "J",
         },
         {
            name: "Priya Patel",
            role: "Senior Backend Engineer",
            review: "As an interviewer, this platform makes evaluating candidates so seamless. The persistent chat and built-in AI hints let me focus entirely on the candidate's problem-solving skills rather than taking notes.",
            avatar: "P",
         },
         {
            name: "Michael Chang",
            role: "Data Scientist",
            review: "The credit system is fantastic. I can practice algorithms exactly when I need to, and the post-interview analytics showed me exactly where I was wasting time on array manipulations.",
            avatar: "M",
         },
         {
            name: "Emily Davis",
            role: "Product Manager",
            review: "I use Evalo to practice product sense and estimation interviews. The experts I've met here are top tier, and having the session recordings to review later is an absolute game changer.",
            avatar: "E",
         }
      ]
   }
}