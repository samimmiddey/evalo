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
         transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
         className="relative group rounded-[2.5rem] bg-[#0c0d12]/60 backdrop-blur-2xl border border-white/10 overflow-hidden shadow-2xl transition-all duration-700 hover:border-violet-500/30 hover:shadow-[0_0_80px_-20px_rgba(139,92,246,0.2)]"
      >
         {/* Animated Background Gradients */}
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[100px] group-hover:bg-violet-500/20 transition-all duration-700 pointer-events-none translate-x-1/3 -translate-y-1/3" />
         <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-fuchsia-600/10 rounded-full blur-[80px] group-hover:bg-fuchsia-500/20 transition-all duration-700 pointer-events-none -translate-x-1/3 translate-y-1/3" />
         
         {/* Mesh Grid Overlay */}
         <div
            className="absolute inset-0 opacity-[0.15] pointer-events-none mix-blend-overlay"
            style={{
               backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
         />

         {/* Inner Glass border effect */}
         <div className="absolute inset-0 rounded-[2.5rem] border border-white/5 pointer-events-none" />

         <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-0">
            {/* Left side: Contact Info Card */}
            <div className="p-8 lg:p-10 2xl:p-12 border-b lg:border-b-0 lg:border-r border-white/10 bg-white/[0.02] flex flex-col justify-between">
               <div>
                  <h3 className="font-outfit text-2xl lg:text-3xl font-bold text-white mb-3">
                     Let&apos;s talk
                  </h3>
                  <p className="text-gray-400 font-inter text-sm lg:text-base leading-relaxed mb-10">
                     Whether you have a question about our services, pricing, or anything else, our team is ready to answer all your questions.
                  </p>

                  <div className="flex flex-col gap-8">
                     <div className="flex items-start gap-4 group/item cursor-pointer">
                        <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 group-hover/item:bg-violet-500 group-hover/item:text-white transition-all duration-300 shadow-[0_0_15px_rgba(139,92,246,0.1)]">
                           <Mail className="w-5 h-5" />
                        </div>
                        <div>
                           <p className="text-gray-400 text-sm mb-1">Email us at</p>
                           <p className="text-white font-medium group-hover/item:text-violet-300 transition-colors">hello@evalo.io</p>
                        </div>
                     </div>

                     <div className="flex items-start gap-4 group/item cursor-pointer">
                        <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-fuchsia-500/10 border border-fuchsia-500/20 flex items-center justify-center text-fuchsia-400 group-hover/item:bg-fuchsia-500 group-hover/item:text-white transition-all duration-300 shadow-[0_0_15px_rgba(217,70,239,0.1)]">
                           <Phone className="w-5 h-5" />
                        </div>
                        <div>
                           <p className="text-gray-400 text-sm mb-1">Call us directly</p>
                           <p className="text-white font-medium group-hover/item:text-fuchsia-300 transition-colors">+1 (555) 123-4567</p>
                        </div>
                     </div>

                     <div className="flex items-start gap-4 group/item cursor-pointer">
                        <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover/item:bg-blue-500 group-hover/item:text-white transition-all duration-300 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                           <MapPin className="w-5 h-5" />
                        </div>
                        <div>
                           <p className="text-gray-400 text-sm mb-1">Visit our office</p>
                           <p className="text-white font-medium group-hover/item:text-blue-300 transition-colors">123 Innovation Dr.<br />San Francisco, CA 94103</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Right side: Form */}
            <div className="p-8 lg:p-10 2xl:p-12">
               <form className="flex flex-col h-full justify-between" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 2xl:gap-8 mb-8">
                     {/* Name */}
                     <div className="flex flex-col gap-2.5">
                        <Label htmlFor="contact-name" className="text-gray-300 text-sm font-semibold tracking-wide ml-1">Full Name</Label>
                        <Input
                           id="contact-name"
                           name="name"
                           type="text"
                           placeholder="John Smith"
                           className="bg-black/20 border-white/10 text-white placeholder:text-gray-600 focus-visible:border-violet-500/50 focus-visible:ring-violet-500/20 h-12 lg:h-14 rounded-xl px-4 transition-all duration-300 hover:border-white/20 hover:bg-black/30"
                        />
                     </div>

                     {/* Email */}
                     <div className="flex flex-col gap-2.5">
                        <Label htmlFor="contact-email" className="text-gray-300 text-sm font-semibold tracking-wide ml-1">Email Address</Label>
                        <Input
                           id="contact-email"
                           name="email"
                           type="email"
                           placeholder="john@example.com"
                           className="bg-black/20 border-white/10 text-white placeholder:text-gray-600 focus-visible:border-violet-500/50 focus-visible:ring-violet-500/20 h-12 lg:h-14 rounded-xl px-4 transition-all duration-300 hover:border-white/20 hover:bg-black/30"
                        />
                     </div>

                     {/* Subject */}
                     <div className="md:col-span-2 flex flex-col gap-2.5">
                        <Label htmlFor="contact-subject" className="text-gray-300 text-sm font-semibold tracking-wide ml-1">Subject</Label>
                        <div className="relative group/select">
                           <select
                              id="contact-subject"
                              name="subject"
                              defaultValue=""
                              className="w-full appearance-none bg-black/20 border border-white/10 text-white focus-visible:border-violet-500/50 focus-visible:ring-3 focus-visible:ring-violet-500/20 focus-visible:outline-none h-12 lg:h-14 rounded-xl px-4 transition-all duration-300 hover:border-white/20 hover:bg-black/30 cursor-pointer pr-10"
                           >
                              <option value="" disabled hidden className="text-gray-500">
                                 How can we help you?
                              </option>
                              {SUBJECTS.map((s) => (
                                 <option key={s} value={s} className="bg-[#0f1016] text-gray-100">
                                    {s}
                                 </option>
                              ))}
                           </select>
                           <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 group-hover/select:text-gray-300 transition-colors duration-300">
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                           </div>
                        </div>
                     </div>

                     {/* Message */}
                     <div className="md:col-span-2 flex flex-col gap-2.5">
                        <Label htmlFor="contact-message" className="text-gray-300 text-sm font-semibold tracking-wide ml-1">
                           Message
                        </Label>
                        <textarea
                           id="contact-message"
                           name="message"
                           rows={5}
                           placeholder="Tell us what you need help with..."
                           className="w-full resize-none bg-black/20 border border-white/10 text-white placeholder:text-gray-600 focus-visible:border-violet-500/50 focus-visible:ring-3 focus-visible:ring-violet-500/20 focus-visible:outline-none rounded-xl p-4 transition-all duration-300 hover:border-white/20 hover:bg-black/30"
                        />
                     </div>
                  </div>

                  {/* Submit */}
                  <div className="mt-4">
                     <Button
                        type="button"
                        className="w-full sm:w-auto h-12 lg:h-14 px-8 bg-white text-black hover:bg-gray-100 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 rounded-xl font-bold text-base shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] group/btn"
                     >
                        <span className="flex items-center gap-2">
                           Send Message
                           <Send className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform duration-300" />
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
