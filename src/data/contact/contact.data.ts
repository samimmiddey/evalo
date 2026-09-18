import { ContactDataTypes } from "./contact.types";
import { MessageCircle, HelpCircle, Mail, Phone, MapPin } from "lucide-react";

export const contactData: ContactDataTypes = {
   hero: {
      header: "We'd love to hear from you",
      title: "Get in touch with our team",
      description:
         "Have a question, a partnership idea, or just want to say hello? Drop us a message and we'll get back to you within one business day.",
   },
   form: {
      icon: MessageCircle,
      header: "Get in Touch",
      title: "Connect With Us",
      description:
         "Have a question or need assistance? Fill out the form below with your details and a brief description of what you need, and our team will get back to you within one business day.",
      formTitle: "Send a Message",
      formDescription:
         "Fill out the details below and our team will get back to you promptly.",
      subjects: [
         "General Inquiry",
         "Technical Support",
         "Billing & Refunds",
         "Partnerships",
         "Become an Interviewer",
         "Other",
      ],
      channels: [
         {
            icon: Mail,
            tag: "Direct Inbox",
            title: "hello@evalo.io",
            desc: "Response within 24 hours",
            href: "mailto:hello@evalo.io",
            isLink: true,
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
               arrowHover:
                  "group-hover:border-indigo-500/40 group-hover:bg-indigo-500/15 group-hover:text-indigo-300",
               shadow: "hover:shadow-[0_0_40px_rgba(99,102,241,0.14)]",
            },
         },
         {
            icon: Phone,
            tag: "Support Line",
            title: "+1 (555) 123-4567",
            desc: "Mon–Fri, 9 AM – 6 PM PST",
            href: "tel:+15551234567",
            isLink: true,
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
               arrowHover:
                  "group-hover:border-cyan-500/40 group-hover:bg-cyan-500/15 group-hover:text-cyan-300",
               shadow: "hover:shadow-[0_0_40px_rgba(6,182,212,0.14)]",
            },
         },
         {
            icon: MapPin,
            tag: "Headquarters",
            title: "San Francisco, CA",
            desc: "123 Innovation Dr., CA 94103",
            href: null,
            isLink: false,
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
               arrowHover:
                  "group-hover:border-amber-500/40 group-hover:bg-amber-500/15 group-hover:text-amber-300",
               shadow: "hover:shadow-[0_0_40px_rgba(245,158,11,0.14)]",
            },
         },
      ],
      metaBadges: {
         replyTime: "Average reply < 24 hrs",
         security: "Encrypted transmission",
      },
   },
   faq: {
      icon: HelpCircle,
      header: "Common Questions",
      title: "Frequently asked questions",
      description:
         "Find answers to the most common questions about mock interviews, credits, and our platform.",
      items: [
         {
            question: "How quickly will I receive a response?",
            answer:
               "We aim to respond to all inquiries within one business day. For urgent matters, we typically respond within a few hours during business hours (Mon–Fri, 9 AM – 6 PM IST).",
         },
         {
            question: "I'm having a technical issue with my session. Who do I contact?",
            answer:
               "Please use the contact form and select 'Technical Support' as your subject. Include your session ID if you have it. Our engineering team monitors support tickets and will prioritize your case.",
         },
         {
            question: "Can I request a refund for unused credits?",
            answer:
               "Yes. If you have unused credits and would like a refund, contact us within 30 days of your purchase. Refunds are processed within 5–7 business days back to your original payment method.",
         },
         {
            question: "How do I become a verified interviewer on Evalo?",
            answer:
               "To apply as an interviewer, create an account and navigate to the 'Become an Interviewer' section in your dashboard. You'll go through a brief onboarding flow including a profile review and a short calibration session.",
         },
         {
            question: "Do you offer enterprise or team plans?",
            answer:
               "Absolutely. We offer custom enterprise plans with volume discounts, team dashboards, and dedicated support. Reach out through the contact form with your company size and requirements and we'll set up a discovery call.",
         },
         {
            question: "Is my personal and payment data secure?",
            answer:
               "Yes. Evalo uses industry-standard encryption for all data in transit and at rest. Payments are processed via a PCI-DSS compliant provider and we never store raw card details on our servers.",
         },
      ],
   },
};
