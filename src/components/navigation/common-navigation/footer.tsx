import Link from "next/link";
import { footerData } from "@/data/navigation/navigation.data";
import Logo from "../../common/logo";
import PrimaryBody from "@/components/common/primary-body";
import SecondaryTitle from "@/components/common/secondary-title";

const Footer = () => {
   const SocialIcon = ({ type }: { type: string; }) => {
      switch (type) {
         case "twitter":
            return (
               <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
               </svg>
            );
         case "github":
            return (
               <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
               </svg>
            );
         case "linkedin":
            return (
               <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.55a1.62 1.62 0 1 0 1.62 1.62A1.62 1.62 0 0 0 7.86 6.55z" />
               </svg>
            );
         default:
            return null;
      }
   };

   const navigationSections = [
      ...footerData.columns,
      {
         title: "Platform",
         links: [
            { name: "Browse Interviewers", href: "/dashboard" },
            { name: "Browse Sessions", href: "/dashboard" },
            { name: "AI Feedback", href: "/dashboard" },
         ],
      },
   ];

   return (
      <footer className="relative s-margin-t pt-16 sm:pt-20 2xl:pt-24 border-t border-white/10 overflow-hidden bg-violet-500/5">

         {/* Subtle Ambient Depth Glow */}
         <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-160 h-40 bg-violet-600/5 blur-[100px]" />

         <div className="container relative z-10">
            {/* Top Grid: Brand & Structured Navigation */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 2xl:gap-18 pb-10 lg:pb-12">
               {/* Brand & Identity Column */}
               <div className="lg:col-span-5 flex flex-col items-start space-y-6">
                  <Link href="/" className="w-fit">
                     <Logo containerClassName="scale-110 2xl:scale-120 origin-left" />
                  </Link>

                  <PrimaryBody
                     text={footerData.description}
                     className="text-zinc-400 text-sm sm:text-[15px] 2xl:text-base leading-relaxed max-w-md font-inter"
                  />

                  {/* Social Icon Row */}
                  <div className="flex items-center gap-2.5 pt-1">
                     {footerData.socials?.map((social, idx) => (
                        <Link
                           key={idx}
                           href={social.href || "#"}
                           target="_blank"
                           rel="noopener noreferrer"
                           aria-label={social.icon}
                           className="flex items-center justify-center w-9 h-9 rounded-lg bg-surface-dark border border-white/8 text-zinc-400 hover:text-zinc-100 hover:border-white/20 hover:bg-white/5 transition-all duration-200"
                        >
                           <SocialIcon type={social.icon} />
                        </Link>
                     ))}
                  </div>
               </div>

               {/* Navigation Links Grid */}
               <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
                  {navigationSections.map((section, idx) => (
                     <div key={idx} className="flex flex-col space-y-4">
                        <SecondaryTitle
                           text={section.title}
                           className="text-sm 2xl:text-lg font-bold uppercase tracking-wider text-zinc-200"
                        />
                        <ul className="space-y-3">
                           {section.links.map((link, lIdx) => (
                              <li key={lIdx}>
                                 <Link
                                    href={link.href}
                                    className="text-sm 2xl:text-[15px] text-zinc-400 hover:text-zinc-100 transition-colors duration-200 inline-block"
                                 >
                                    {link.name}
                                 </Link>
                              </li>
                           ))}
                        </ul>
                     </div>
                  ))}
               </div>
            </div>

            {/* Bottom Row: Copyright & Legal */}
            <div className="border-t border-white/6 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 2xl:gap-4 text-sm 2xl:text-[15px] text-zinc-500">
               <p className="font-inter">
                  {footerData.copyright}
               </p>

               <div className="flex items-center gap-6 text-sm 2xl:text-[15px] text-zinc-500">
                  <Link href="/about" className="hover:text-zinc-300 transition-colors">
                     Privacy Policy
                  </Link>
                  <Link href="/about" className="hover:text-zinc-300 transition-colors">
                     Terms of Service
                  </Link>
                  <Link href="/about" className="hover:text-zinc-300 transition-colors">
                     Security
                  </Link>
               </div>
            </div>

            {/* Centered Brand Watermark with Hairlines */}
            <div className="w-full flex items-center justify-center gap-4 sm:gap-8 pt-5 sm:pt-6 overflow-hidden select-none pointer-events-none">
               <div className="h-px bg-linear-to-l from-white/10 to-transparent grow min-w-8" />
               <span className="font-musemoderno font-black text-[15vw] md:text-[10vw] tracking-tight uppercase leading-none bg-linear-to-b from-white/8 via-white/2 to-transparent bg-clip-text text-transparent block shrink-0">
                  evalo
               </span>
               <div className="h-px bg-linear-to-r from-white/10 to-transparent grow min-w-8" />
            </div>
         </div>
      </footer>
   );
};

export default Footer;
