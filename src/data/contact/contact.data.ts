import { ContactDataTypes } from "./contact.types";
import { MessageCircle, HelpCircle } from "lucide-react";

export const contactData: ContactDataTypes = {
   hero: {
      header: "We'd love to hear from you",
      title: "Get in touch with our team",
      description:
         "Have a question, a partnership idea, or just want to say hello? Drop us a message and we'll get back to you within one business day.",
   },
   form: {
      icon: MessageCircle,
      header: "Send a Message",
      title: "Tell us what's on your mind",
      description:
         "Fill out the form below and one of our team members will respond promptly. We're here to help with anything you need.",
   },
   faq: {
      icon: HelpCircle,
      header: "Common Questions",
      title: "Frequently asked questions",
      description:
         "Can't find the answer you're looking for? Reach out directly through the form above and we'll be happy to help.",
      items: [
         {
            question: "How quickly will I receive a response?",
            answer:
               "We aim to respond to all inquiries within one business day. For urgent matters, we typically respond within a few hours during business hours (Mon–Fri, 9 AM – 6 PM IST).",
         },
         {
            question: "I'm having a technical issue with my session. Who do I contact?",
            answer:
               "Please use the contact form above and select 'Technical Support' as your subject. Include your session ID if you have it. Our engineering team monitors support tickets and will prioritize your case.",
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
