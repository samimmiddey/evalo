"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
   Select,
   SelectContent,
   SelectGroup,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { Send, ArrowUpRight, ShieldCheck, Clock } from "lucide-react";
import SecondaryTitle from "@/components/common/secondary-title";
import PrimaryBody from "@/components/common/primary-body";
import { toast } from "sonner";
import { contactData } from "@/data/contact/contact.data";

const ContactForm = () => {
   const { formTitle, formDescription, channels, subjects, metaBadges } =
      contactData.form;

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      toast.success("Thank you! Your message has been sent successfully.");
   };

   return (
      <div className="space-y-8 lg:space-y-10">
         {/* Top 3-Column Themed Channel Cards */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
            {channels.map((item, idx) => {
               const Icon = item.icon;
               const theme = item.theme;
               const numberStr = String(idx + 1).padStart(2, "0");

               const Content = (
                  <div
                     className={`group relative flex flex-col justify-between h-full px-6 py-7 lg:p-7 rounded-3xl bg-surface-dark/90 border ${theme.border} ${theme.hoverBorder} overflow-hidden transition-all duration-500 hover:-translate-y-1 ${theme.shadow}`}
                  >
                     {/* Top Gradient Wash */}
                     <div
                        className={`absolute inset-0 bg-linear-to-b ${theme.gradient} pointer-events-none transition-opacity duration-500 group-hover:opacity-100 opacity-60`}
                     />

                     {/* Top Border Shimmer */}
                     <div
                        className={`absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-white/10 ${theme.topShimmer} to-transparent transition-colors duration-500 pointer-events-none`}
                     />

                     {/* Ambient Radial Glow Orb */}
                     <div
                        className={`pointer-events-none absolute -top-20 -right-20 w-48 h-48 rounded-full blur-[70px] transition-all duration-700 ${theme.glow}`}
                     />

                     <div className="relative z-10">
                        {/* Header: Icon & Monospace Counter */}
                        <div className="flex items-center justify-between mb-5">
                           <div
                              className={`flex items-center justify-center w-11 h-11 rounded-xl ${theme.iconBg} ${theme.iconBorder} ${theme.iconText} border shadow-inner transition-all duration-300 group-hover:scale-105`}
                           >
                              <Icon className="w-5 h-5" />
                           </div>
                           <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/2 border border-white/5">
                              <span className={`w-1.5 h-1.5 rounded-full ${theme.dotBg}`} />
                              <span
                                 className={`font-mono text-xs font-semibold tracking-wider ${theme.badgeText}`}
                              >
                                 {numberStr}
                              </span>
                           </div>
                        </div>

                        {/* Category & Title */}
                        <span
                           className={`font-mono text-xs font-semibold uppercase tracking-wider ${theme.badgeText} block mb-1.25`}
                        >
                           {item.tag}
                        </span>
                        <h4 className="text-lg font-geist font-semibold text-zinc-100 group-hover:text-white transition-colors">
                           {item.title}
                        </h4>
                     </div>

                     {/* Bottom Row */}
                     <div className="relative z-10 mt-5 pt-4 border-t border-white/6 flex items-center justify-between text-xs">
                        <span className="text-xs text-zinc-400">
                           {item.desc}
                        </span>
                        {item.isLink && (
                           <div
                              className={`w-7 h-7 rounded-full bg-white/3 border border-white/8 ${theme.arrowHover} flex items-center justify-center text-zinc-400 transition-all duration-300 shrink-0 ml-2`}
                           >
                              <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                           </div>
                        )}
                     </div>
                  </div>
               );

               return item.isLink ? (
                  <a key={idx} href={item.href!} className="block cursor-pointer">
                     {Content}
                  </a>
               ) : (
                  <div key={idx}>{Content}</div>
               );
            })}
         </div>

         {/* Main Form Card */}
         <div className="px-6 py-7 lg:p-8 2xl:p-10 rounded-3xl bg-surface-dark border border-white/8 shadow-2xl">
            <div className="mb-6 2xl:mb-8">
               <SecondaryTitle
                  text={formTitle}
                  className="font-semibold mb-2 text-xl lg:text-2xl 2xl:text-3xl"
               />
               <PrimaryBody
                  text={formDescription}
                  className="text-sm lg:text-[15px] 2xl:text-base text-zinc-400"
               />
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 2xl:space-y-6">
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 2xl:gap-6">
                  {/* Name */}
                  <div className="space-y-2">
                     <Label htmlFor="contact-name" className="text-sm text-zinc-300">
                        Full Name
                     </Label>
                     <Input
                        id="contact-name"
                        name="name"
                        type="text"
                        required
                        placeholder="John Doe"
                        className="bg-white/3 border-white/10 text-zinc-100 placeholder:text-zinc-600"
                     />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                     <Label htmlFor="contact-email" className="text-sm text-zinc-300">
                        Email Address
                     </Label>
                     <Input
                        id="contact-email"
                        name="email"
                        type="email"
                        required
                        placeholder="john@example.com"
                        className="bg-white/3 border-white/10 text-zinc-100 placeholder:text-zinc-600"
                     />
                  </div>
               </div>

               {/* Phone & Subject */}
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 2xl:gap-6">
                  {/* Phone Number */}
                  <div className="space-y-2">
                     <Label htmlFor="contact-phone" className="text-sm text-zinc-300">
                        Phone Number
                     </Label>
                     <Input
                        id="contact-phone"
                        name="phone"
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        className="bg-white/3 border-white/10 text-zinc-100 placeholder:text-zinc-600"
                     />
                  </div>

                  {/* Subject */}
                  <div className="flex flex-col gap-2">
                     <Label htmlFor="contact-subject" className="text-sm text-zinc-300">
                        Subject
                     </Label>
                     <Select name="subject" required>
                        <SelectTrigger
                           id="contact-subject"
                           className="w-full bg-white/3 border-white/10 text-zinc-100 placeholder:text-zinc-600"
                        >
                           <SelectValue placeholder="Select a subject..." />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectGroup>
                              {subjects.map((s) => (
                                 <SelectItem key={s} value={s}>
                                    {s}
                                 </SelectItem>
                              ))}
                           </SelectGroup>
                        </SelectContent>
                     </Select>
                  </div>
               </div>

               {/* Message */}
               <div className="space-y-2">
                  <Label htmlFor="contact-message" className="text-sm text-zinc-300">
                     Message
                  </Label>
                  <Textarea
                     id="contact-message"
                     name="message"
                     rows={5}
                     required
                     placeholder="How can we help you?"
                     className="w-full rounded-lg border border-white/10 bg-white/3 p-3 text-sm text-zinc-100 outline-none transition-all placeholder:text-zinc-600 resize-none h-28"
                  />
               </div>

               {/* Submit Dock */}
               <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="hidden sm:flex items-center gap-4 text-xs text-zinc-500">
                     <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{metaBadges.replyTime}</span>
                     </div>
                     <div className="flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>{metaBadges.security}</span>
                     </div>
                  </div>

                  <Button
                     type="submit"
                     size="xxl"
                     variant="white"
                     className="w-full sm:w-auto font-medium group/btn gap-2"
                  >
                     <span>Send Message</span>
                     <Send className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                  </Button>
               </div>
            </form>
         </div>
      </div>
   );
};

export default ContactForm;
