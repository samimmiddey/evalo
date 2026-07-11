import PrimaryBody from '@/components/common/primary-body'

const AuthBranding = () => {
   return (
      <div className="hidden md:flex w-full md:w-1/2 bg-surface-dark p-6 lg:p-8 2xl:p-10 flex-col justify-between gap-7 relative group border-r border-border/40">
         {/* Background decorative elements */}
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light z-0" />
         <div className="absolute top-[-30%] left-[-10%] w-[70%] h-[70%] rounded-full bg-violet-600/20 blur-[120px] z-0 transition-transform duration-1000 group-hover:scale-110" />
         <div className="absolute bottom-[-30%] right-[-10%] w-[70%] h-[70%] rounded-full bg-fuchsia-600/20 blur-[120px] z-0 transition-transform duration-1000 group-hover:scale-110" />

         {/* Grid Pattern */}
         <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-size-[24px_24px] mask-[radial-gradient(ellipse_60%_50%_at_50%_50%,black_70%,transparent_100%)] z-0 opacity-50" />

         <div className="z-10 flex flex-col gap-2 mt-4 ml-2">
            <h1 className="text-4xl 2xl:text-5xl font-lobster font-bold tracking-tight bg-linear-to-r from-white via-violet-200 to-white/70 bg-clip-text text-transparent drop-shadow-sm">Evalo</h1>
            <PrimaryBody
               text='Evaluate talent with clarity and confidence. The modern platform for technical assessments.'
               className='mt-2 max-w-sm w-full 2xl:text-base'
            />
         </div>

         <div className="z-10 mt-auto mb-4 mx-2">
            <div className="p-7 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl relative overflow-hidden group/card transition-all duration-500 hover:bg-white/[0.07] hover:border-white/20">
               {/* Subtle inner glow for the card */}
               <div className="absolute -top-24 -right-24 w-48 h-48 bg-violet-500/20 rounded-full blur-[50px] opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 z-0" />

               <blockquote className="space-y-6 relative z-10">
                  <svg className="h-8 w-8 text-violet-400/50 mb-2" fill="currentColor" viewBox="0 0 24 24">
                     <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                  <PrimaryBody
                     text="Evalo has completely transformed how we discover and evaluate engineering talent. The intuitive design and deep insights are unmatched."
                     className='text-gray-200'
                  />
                  <footer className="flex items-center gap-4 pt-4 border-t border-white/10">
                     <div className="w-12 h-12 rounded-full bg-linear-to-tr from-violet-600 to-fuchsia-600 p-[2px] shadow-lg shadow-violet-500/20">
                        <div className="w-full h-full bg-surface-dark rounded-full flex items-center justify-center">
                           <span className="text-white font-bold font-outfit text-sm">SD</span>
                        </div>
                     </div>
                     <div className="flex flex-col">
                        <span className="text-base text-white font-medium">Sofia Davis</span>
                        <span className="text-sm text-violet-300/80">VP of Engineering, Acme Corp</span>
                     </div>
                  </footer>
               </blockquote>
            </div>
         </div>
      </div>
   )
}

export default AuthBranding