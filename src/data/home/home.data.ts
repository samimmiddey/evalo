import { HomeDataTypes } from "./home.types";
import { Video, BrainCircuit, Library, LineChart, CalendarClock, Zap, Shuffle, CreditCard, MessageSquareQuote, Rocket, User, BriefcaseBusiness } from 'lucide-react';

export const homeData: HomeDataTypes = {
   hero: {
      header: "Evaluate Your True Potential",
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
            tag: "HD Video & Context",
            title: "Live Interview Sessions & Persistent Chat",
            description:
               "Connect with interviewers through smooth HD video calls and persistent chat that keeps your entire conversation history, shared context, and discussion flow in one place, making it easy to revisit decisions, clarify doubts, and stay aligned throughout the interview process.",
            theme: {
               gradient: "from-indigo-600/15 via-indigo-950/5 to-transparent",
               glow: "bg-indigo-500/15 group-hover:bg-indigo-500/25",
               border: "border-indigo-500/20",
               hoverBorder: "group-hover:border-indigo-500/45",
               topShimmer: "group-hover:via-indigo-400/60",
               iconBg: "bg-indigo-500/15 group-hover:bg-indigo-500/25",
               iconText: "text-indigo-400 group-hover:text-indigo-300",
               iconBorder: "border-indigo-500/30",
               dotBg: "bg-indigo-400",
               badgeText: "text-indigo-400",
               arrowHover: "group-hover:border-indigo-500/40 group-hover:bg-indigo-500/15 group-hover:text-indigo-300",
               shadow: "hover:shadow-[0_0_40px_rgba(99,102,241,0.14)]",
            },
         },
         {
            icon: BrainCircuit,
            tag: "AI Intelligence",
            title: "AI-Assisted Performance Evaluation",
            description:
               "Receive instant, objective feedback on your solutions with insights on code quality, complexity, and adherence to best practices to help you improve faster.",
            theme: {
               gradient: "from-cyan-600/15 via-cyan-950/5 to-transparent",
               glow: "bg-cyan-500/15 group-hover:bg-cyan-500/25",
               border: "border-cyan-500/20",
               hoverBorder: "group-hover:border-cyan-500/45",
               topShimmer: "group-hover:via-cyan-400/60",
               iconBg: "bg-cyan-500/15 group-hover:bg-cyan-500/25",
               iconText: "text-cyan-400 group-hover:text-cyan-300",
               iconBorder: "border-cyan-500/30",
               dotBg: "bg-cyan-400",
               badgeText: "text-cyan-400",
               arrowHover: "group-hover:border-cyan-500/40 group-hover:bg-cyan-500/15 group-hover:text-cyan-300",
               shadow: "hover:shadow-[0_0_40px_rgba(6,182,212,0.14)]",
            },
         },
         {
            icon: Library,
            tag: "Flexible Economy",
            title: "Flexible Credit-Based Access",
            description:
               "Subscribe to monthly credits, book interview sessions instantly, and manage usage easily while interviewers can earn credits and withdraw their earnings anytime.",
            theme: {
               gradient: "from-amber-600/15 via-amber-950/5 to-transparent",
               glow: "bg-amber-500/15 group-hover:bg-amber-500/25",
               border: "border-amber-500/20",
               hoverBorder: "group-hover:border-amber-500/45",
               topShimmer: "group-hover:via-amber-400/60",
               iconBg: "bg-amber-500/15 group-hover:bg-amber-500/25",
               iconText: "text-amber-400 group-hover:text-amber-300",
               iconBorder: "border-amber-500/30",
               dotBg: "bg-amber-400",
               badgeText: "text-amber-400",
               arrowHover: "group-hover:border-amber-500/40 group-hover:bg-amber-500/15 group-hover:text-amber-300",
               shadow: "hover:shadow-[0_0_40px_rgba(245,158,11,0.14)]",
            },
         },
         {
            icon: LineChart,
            tag: "Growth Analytics",
            title: "Detailed Performance Reports",
            description:
               "Track your progress over time with in-depth analytics that highlight strengths, weaknesses, and actionable areas for improvement.",
            theme: {
               gradient: "from-emerald-600/15 via-emerald-950/5 to-transparent",
               glow: "bg-emerald-500/15 group-hover:bg-emerald-500/25",
               border: "border-emerald-500/20",
               hoverBorder: "group-hover:border-emerald-500/45",
               topShimmer: "group-hover:via-emerald-400/60",
               iconBg: "bg-emerald-500/15 group-hover:bg-emerald-500/25",
               iconText: "text-emerald-400 group-hover:text-emerald-300",
               iconBorder: "border-emerald-500/30",
               dotBg: "bg-emerald-400",
               badgeText: "text-emerald-400",
               arrowHover: "group-hover:border-emerald-500/40 group-hover:bg-emerald-500/15 group-hover:text-emerald-300",
               shadow: "hover:shadow-[0_0_40px_rgba(16,185,129,0.14)]",
            },
         },
         {
            icon: CalendarClock,
            tag: "Smart Scheduling",
            title: "Slot-Based Scheduling",
            description:
               "Easily book and manage interview sessions using flexible time slots, allowing candidates and interviewers to coordinate availability seamlessly without conflicts.",
            theme: {
               gradient: "from-fuchsia-600/15 via-fuchsia-950/5 to-transparent",
               glow: "bg-fuchsia-500/15 group-hover:bg-fuchsia-500/25",
               border: "border-fuchsia-500/20",
               hoverBorder: "group-hover:border-fuchsia-500/45",
               topShimmer: "group-hover:via-fuchsia-400/60",
               iconBg: "bg-fuchsia-500/15 group-hover:bg-fuchsia-500/25",
               iconText: "text-fuchsia-400 group-hover:text-fuchsia-300",
               iconBorder: "border-fuchsia-500/30",
               dotBg: "bg-fuchsia-400",
               badgeText: "text-fuchsia-400",
               arrowHover: "group-hover:border-fuchsia-500/40 group-hover:bg-fuchsia-500/15 group-hover:text-fuchsia-300",
               shadow: "hover:shadow-[0_0_40px_rgba(217,70,239,0.14)]",
            },
         }
      ]
   },
   roles: {
      icon: Shuffle,
      header: "Two Sides. One Platform.",
      title: "Where Talent Meets Opportunity",
      description: "Where talent meets real opportunity through structured interviews, skill-based assessments, and meaningful evaluation that helps candidates grow and get discovered.",
      interviewee: {
         icon: User,
         tag: "FOR CANDIDATES",
         trackLabel: "CANDIDATE PIPELINE",
         statusLabel: "PREPARATION ENGINE",
         workflowTitle: "CORE CAPABILITIES & WORKFLOW",
         index: "01",
         title: "Land the role you deserve",
         description:
            "Practice real interview scenarios, sharpen your problem-solving skills, and get evaluated through structured assessments designed to reflect hiring standards. Build confidence and improve with every attempt.",
         points: [
            "Solve real-world coding and system design problems",
            "Get instant AI-driven performance feedback",
            "Track progress with detailed skill insights",
            "Practice in a real interview-like environment",
            "Improve with every attempt you take",
         ],
         cta: {
            text: "Browse Interviewers",
            href: "/interviewers",
         },
         theme: {
            gradient: "from-indigo-600/15 via-indigo-950/5 to-transparent",
            glow: "bg-indigo-500/15 group-hover:bg-indigo-500/25",
            border: "border-indigo-500/20",
            hoverBorder: "group-hover:border-indigo-500/45",
            topShimmer: "group-hover:via-indigo-400/60",
            iconBg: "bg-indigo-500/15 group-hover:bg-indigo-500/25",
            iconText: "text-indigo-400 group-hover:text-indigo-300",
            iconBorder: "border-indigo-500/30",
            dotBg: "bg-indigo-400",
            badgeText: "text-indigo-400",
            checkBg: "bg-indigo-500/15",
            checkBorder: "border-indigo-500/30",
            checkColor: "text-indigo-400",
            arrowHover: "group-hover:border-indigo-500/40 group-hover:bg-indigo-500/15 group-hover:text-indigo-300",
            shadow: "hover:shadow-[0_0_40px_rgba(99,102,241,0.14)]",
            buttonClass: "bg-indigo-600 hover:bg-indigo-500! text-white shadow-[0_0_20px_rgba(79,70,229,0.25)]",
         },
      },

      interviewer: {
         icon: BriefcaseBusiness,
         tag: "FOR INTERVIEWERS",
         trackLabel: "EXPERT NETWORK",
         statusLabel: "VERIFIED COHORT",
         workflowTitle: "CORE CAPABILITIES & WORKFLOW",
         index: "02",
         title: "Put Your Expertise to Work",
         description:
            "Conduct interviews on your own schedule, evaluate candidates efficiently, and earn credits for every session you complete. Share your expertise while helping others grow in their careers and achieve their goals.",
         points: [
            "Conduct structured technical interviews remotely",
            "Evaluate candidates using guided assessment flows",
            "Earn credits for every completed session",
            "Withdraw earnings anytime with ease",
            "Build reputation as a trusted interviewer",
         ],
         cta: {
            text: "Join as an Interviewer",
            href: "/dashboard",
         },
         theme: {
            gradient: "from-emerald-600/15 via-emerald-950/5 to-transparent",
            glow: "bg-emerald-500/15 group-hover:bg-emerald-500/25",
            border: "border-emerald-500/20",
            hoverBorder: "group-hover:border-emerald-500/45",
            topShimmer: "group-hover:via-emerald-400/60",
            iconBg: "bg-emerald-500/15 group-hover:bg-emerald-500/25",
            iconText: "text-emerald-400 group-hover:text-emerald-300",
            iconBorder: "border-emerald-500/30",
            dotBg: "bg-emerald-400",
            badgeText: "text-emerald-400",
            checkBg: "bg-emerald-500/15",
            checkBorder: "border-emerald-500/30",
            checkColor: "text-emerald-400",
            arrowHover: "group-hover:border-emerald-500/40 group-hover:bg-emerald-500/15 group-hover:text-emerald-300",
            shadow: "hover:shadow-[0_0_40px_rgba(16,185,129,0.14)]",
            buttonClass: "bg-emerald-600 hover:bg-emerald-500! text-white shadow-[0_0_20px_rgba(5,150,105,0.25)]",
         },
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
   },
   cta: {
      icon: Rocket,
      header: "Get Started",
      title: "Ready to accelerate your career?",
      description: "Join thousands of candidates and industry experts who are already using Evalo to sharpen their skills, gain valuable interview experience, connect with opportunities, and achieve their professional goals with confidence."
   }
};