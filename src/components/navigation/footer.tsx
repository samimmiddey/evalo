import { BotMessageSquare } from 'lucide-react'
import Link from 'next/link'
import { footerData } from '@/data/navigation/navigation.data'

const Footer = () => {
   const SocialIcon = ({ type }: { type: string }) => {
      switch (type) {
         case 'twitter': return (
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
               <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
            </svg>
         );
         case 'github': return (
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
               <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
               <path d="M9 18c-4.51 2-5-2-7-2" />
            </svg>
         );
         case 'linkedin': return (
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
               <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
               <rect width="4" height="12" x="2" y="9" />
               <circle cx="4" cy="4" r="2" />
            </svg>
         );
         default: return null;
      }
   }

   return (
      <footer className="relative s-padding-t pb-6 s-margin-t overflow-hidden border-t border-white/5">
         {/* Deep background ambient glows */}
         <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />
         <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-fuchsia-600/10 rounded-full blur-[120px] pointer-events-none" />

         {/* Top glassmorphic gradient line */}
         <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-violet-500/50 to-transparent" />

         <div className="container relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-8 lg:gap-10 mb-13 lg:mb-15 2xl:mb-16">
               {/* Brand Info */}
               <div className="xl:col-span-2 flex flex-col gap-5 lg:gap-6">
                  <Link href='/' className='flex items-center gap-1.5 text-violet-400 w-fit'>
                     <BotMessageSquare className='mt-0.5 h-6.5 2xl:h-7 w-6.5 2xl:w-7' />
                     <h4 className='font-musemoderno font-bold text-xl 2xl:text-2xl'>evalo</h4>
                  </Link>
                  <p className="text-gray-400 font-inter text-[15px] leading-relaxed max-w-sm">
                     {footerData.description}
                  </p>
               </div>

               {/* Navigation Links */}
               {footerData.columns.map((col, idx) => (
                  <div key={idx} className="flex flex-col gap-5 lg:gap-6 xl:col-span-1">
                     <h5 className="text-gray-100 font-semibold text-lg font-outfit tracking-wide">
                        {col.title}
                     </h5>
                     <div className="flex flex-col gap-4">
                        {col.links.map((link, lIdx) => (
                           <Link
                              key={lIdx}
                              href={link.href}
                              className="group flex items-center gap-3 text-gray-400 hover:text-white transition-all duration-300 font-inter text-[15px] w-fit"
                           >
                              {link.name}
                           </Link>
                        ))}
                     </div>
                  </div>
               ))}

               {/* Mini CTA */}
               <div className="xl:col-span-2 flex flex-col gap-5 lg:gap-6">
                  <h5 className="text-gray-100 font-semibold text-lg font-outfit tracking-wide">
                     Ready to start?
                  </h5>
                  <p className="text-gray-400 font-inter text-[15px] leading-relaxed">
                     Join thousands of candidates and experts who are already using Evalo to achieve their goals.
                  </p>
                  <div className="relative group w-fit mt-1">
                     <div className="absolute -inset-0.5 bg-linear-to-r from-violet-600 to-fuchsia-600 rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-500" />
                     <Link href="/signup" className="relative flex items-center gap-2 px-6 py-3 bg-surface-dark border border-white/10 rounded-xl text-white font-medium hover:bg-surface-hover transition-colors shadow-xl">
                        Get Started for Free
                        <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                     </Link>
                  </div>
               </div>
            </div>

            {/* Giant Watermark Text & Footer Bottom */}
            <div className="w-full border-t border-white/5 relative overflow-hidden pt-6 flex flex-col items-center">
               <h1 className="text-[14vw] xl:text-[180px] leading-none font-bold text-center text-white/3 select-none pointer-events-none font-musemoderno tracking-tighter uppercase mb-4 md:mb-0">
                  EVALO
               </h1>

               {/* Overlay for social/copyright */}
               <div className="md:absolute inset-0 flex flex-col md:flex-row items-center justify-between md:px-4 md:mt-auto md:pb-6 gap-6 z-10 h-fit self-end w-full">
                  <p className="text-gray-500 font-inter text-[15px]">
                     {footerData.copyright}
                  </p>

                  <div className="flex items-center gap-4">
                     {footerData.socials?.map((social, idx) => (
                        <Link
                           key={idx}
                           href={social.href}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-violet-600 hover:border-violet-500 hover:shadow-[0_0_20px_rgba(124,58,237,0.5)] hover:-translate-y-1 transition-all duration-300"
                        >
                           <SocialIcon type={social.icon} />
                        </Link>
                     ))}
                  </div>
               </div>
            </div>
         </div>
      </footer>
   )
}

export default Footer
