"use client";

import { motion } from "motion/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Send, MapPin, Phone, Mail } from "lucide-react";

const SUBJECTS = [
   "General Inquiry",
   "Technical Support",
   "Billing & Refunds",
   "Partnerships",
   "Become an Interviewer",
   "Other",
];

const ContactForm = () => {
   return (
      <motion.div
         initial={{ opacity: 0, y: 24 }}
         whileInView={{ opacity: 1, y: 0 }}
         viewport={{ once: true, margin: "-50px", amount: 0.1 }}
         transition={{ duration: 0.5, ease: "easeOut" }}
         className="group relative rounded-3xl bg-surface-dark/80 border border-violet-500/25 overflow-hidden transition-all duration-500 hover:border-violet-500/40 hover:shadow-[0_0_60px_-20px_rgba(139,92,246,0.3)]"
      >
         {/* Background Glows matching project style */}
         <div className="absolute top-0 right-0 w-80 h-80 bg-violet-500/15 rounded-full blur-[80px] group-hover:bg-violet-500/25 transition-colors duration-500 pointer-events-none" />
         <div className="absolute bottom-0 left-0 w-56 h-56 bg-fuchsia-600/8 rounded-full blur-[60px] pointer-events-none" />

         <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1fr_1.5fr]">
            {/* Left side: Contact Info Card */}
            <div className="p-8 lg:p-10 2xl:p-12 border-b lg:border-b-0 lg:border-r border-white/5 flex flex-col justify-between">
               <div>
                  <h3 className="font-outfit text-2xl lg:text-3xl font-semibold text-gray-100 mb-3">
                     Let&apos;s talk
                  </h3>
                  <p className="text-gray-400 font-inter text-sm lg:text-[15px] leading-relaxed mb-10">
                     Whether you have a question about our services, pricing, or anything else, our team is ready to answer all your questions.
                  </p>

                  <div className="flex flex-col gap-8">
                     <div className="flex items-start gap-4 group/item cursor-pointer">
                        <div className="shrink-0 inline-flex p-2.5 lg:p-3 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-400 group-hover/item:text-violet-300 group-hover/item:border-violet-400/50 group-hover/item:bg-violet-500/20 transition-all duration-300 shadow-sm">
                           <Mail className="w-5 h-5" />
                        </div>
                        <div className="pt-0.5">
                           <p className="text-gray-500 font-inter text-sm mb-1">Email us at</p>
                           <p className="text-gray-200 font-medium group-hover/item:text-white transition-colors duration-300">hello@evalo.io</p>
                        </div>
                     </div>

                     <div className="flex items-start gap-4 group/item cursor-pointer">
                        <div className="shrink-0 inline-flex p-2.5 lg:p-3 rounded-lg bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400 group-hover/item:text-fuchsia-300 group-hover/item:border-fuchsia-400/50 group-hover/item:bg-fuchsia-500/20 transition-all duration-300 shadow-sm">
                           <Phone className="w-5 h-5" />
                        </div>
                        <div className="pt-0.5">
                           <p className="text-gray-500 font-inter text-sm mb-1">Call us directly</p>
                           <p className="text-gray-200 font-medium group-hover/item:text-white transition-colors duration-300">+1 (555) 123-4567</p>
                        </div>
                     </div>

                     <div className="flex items-start gap-4 group/item cursor-pointer">
                        <div className="shrink-0 inline-flex p-2.5 lg:p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 group-hover/item:text-blue-300 group-hover/item:border-blue-400/50 group-hover/item:bg-blue-500/20 transition-all duration-300 shadow-sm">
                           <MapPin className="w-5 h-5" />
                        </div>
                        <div className="pt-0.5">
                           <p className="text-gray-500 font-inter text-sm mb-1">Visit our office</p>
                           <p className="text-gray-200 font-medium group-hover/item:text-white transition-colors duration-300">123 Innovation Dr.<br />San Francisco, CA 94103</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Right side: Form */}
            <div className="p-8 lg:p-10 2xl:p-12">
               <form className="flex flex-col h-full justify-between" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 2xl:gap-6 mb-8">
                     {/* Name */}
                     <div className="flex flex-col gap-2">
                        <Label htmlFor="contact-name">Full Name</Label>
                        <Input
                           id="contact-name"
                           name="name"
                           type="text"
                           placeholder="John Smith"
                           className="transition-all duration-200 hover:border-violet-500/30"
                        />
                     </div>

                     {/* Email */}
                     <div className="flex flex-col gap-2">
                        <Label htmlFor="contact-email">Email Address</Label>
                        <Input
                           id="contact-email"
                           name="email"
                           type="email"
                           placeholder="john@example.com"
                           className="transition-all duration-200 hover:border-violet-500/30"
                        />
                     </div>

                     {/* Subject */}
                     <div className="md:col-span-2 flex flex-col gap-2">
                        <Label htmlFor="contact-subject">Subject</Label>
                        <div className="relative">
                           <select
                              id="contact-subject"
                              name="subject"
                              defaultValue=""
                              className="w-full min-w-0 appearance-none rounded-lg border border-input bg-transparent dark:bg-input/30 bg-background/50 px-2.5 py-1 text-sm 2xl:text-base outline-none h-10 2xl:h-11 transition-all hover:border-violet-500/30 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 text-foreground cursor-pointer pr-9"
                           >
                              <option value="" disabled hidden className="text-muted-foreground/50">
                                 Select a subject…
                              </option>
                              {SUBJECTS.map((s) => (
                                 <option key={s} value={s} className="bg-zinc-900 text-gray-100">
                                    {s}
                                 </option>
                              ))}
                           </select>
                           <svg
                              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              aria-hidden="true"
                           >
                              <polyline points="6 9 12 15 18 9" />
                           </svg>
                        </div>
                     </div>

                     {/* Message */}
                     <div className="md:col-span-2 flex flex-col gap-2">
                        <Label htmlFor="contact-message">
                           Message
                        </Label>
                        <textarea
                           id="contact-message"
                           name="message"
                           rows={5}
                           placeholder="Tell us what you need help with…"
                           className="w-full min-w-0 rounded-lg border border-input bg-transparent dark:bg-input/30 bg-background/50 px-2.5 py-2 text-sm 2xl:text-base outline-none transition-all hover:border-violet-500/30 resize-none placeholder:text-muted-foreground/50 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 text-foreground"
                        />
                     </div>
                  </div>

                  {/* Submit */}
                  <div className="mt-4">
                     <Button
                        type="button"
                        size="xxl"
                        variant="white"
                        className="w-full sm:w-auto shrink-0 group/btn"
                     >
                        <span className="flex items-center gap-2">
                           Send Message
                           <Send className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
                        </span>
                     </Button>
                  </div>
               </form>
            </div>
         </div>
      </motion.div>
   );
};

export default ContactForm;
