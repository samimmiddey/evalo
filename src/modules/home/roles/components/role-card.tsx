import { motion } from 'motion/react'
import { Check, User, BriefcaseBusiness } from 'lucide-react'
import { RoleCard as RoleCardType } from '@/data/home/home.types'

interface RoleCardProps {
   i: number
   role: RoleCardType
   type: "Interviewees" | "Interviewers"
}

const RoleCard = ({ i, role, type }: RoleCardProps) => {
   const isInterviewee = type === "Interviewees"

   // Distinct themes for each role side to make them uniquely attractive side-by-side
   const theme = isInterviewee ? {
      gradient: "from-blue-600/20 via-transparent to-transparent",
      glow: "bg-blue-500/10 group-hover:bg-blue-500/20",
      border: "border-blue-500/20 group-hover:border-blue-500/40",
      badge: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      title: "from-blue-100 to-blue-400",
      icon: "text-blue-400 bg-blue-500/10",
      check: "text-blue-400",
      listBg: "bg-blue-950/20 border-blue-500/10 group-hover:border-blue-500/20",
      shadow: "hover:shadow-[0_0_40px_rgba(59,130,246,0.15)]"
   } : {
      gradient: "from-fuchsia-600/20 via-transparent to-transparent",
      glow: "bg-fuchsia-500/10 group-hover:bg-fuchsia-500/20",
      border: "border-fuchsia-500/20 group-hover:border-fuchsia-500/40",
      badge: "bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20",
      title: "from-fuchsia-100 to-fuchsia-400",
      icon: "text-fuchsia-400 bg-fuchsia-500/10",
      check: "text-fuchsia-400",
      listBg: "bg-fuchsia-950/20 border-fuchsia-500/10 group-hover:border-fuchsia-500/20",
      shadow: "hover:shadow-[0_0_40px_rgba(217,70,239,0.15)]"
   }

   const HeaderIcon = isInterviewee ? User : BriefcaseBusiness

   return (
      <motion.div
         key={i}
         initial={{ opacity: 0, y: 30 }}
         whileInView={{ opacity: 1, y: 0 }}
         viewport={{ once: true, margin: "-50px", amount: 0.1 }}
         transition={{ duration: 0.5, delay: i * 0.1, ease: 'easeOut' }}
         className={`group relative flex flex-col h-full rounded-3xl bg-[#0f1016]/90 border ${theme.border} overflow-hidden transition-all duration-500 hover:-translate-y-2 ${theme.shadow}`}
      >
         {/* Top Gradient Wash */}
         <div className={`absolute inset-0 bg-linear-to-b ${theme.gradient} opacity-50`} />

         {/* Massive Ambient Glow */}
         <div className={`absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[100px] transition-colors duration-700 ${theme.glow} -translate-y-1/2 translate-x-1/3`} />

         <div className="relative z-10 flex flex-col grow p-7 lg:p-9 2xl:p-11">

            {/* Header / Badge */}
            <div className="flex items-center gap-3.5 mb-5 lg:mb-6 2xl:mb-8">
               <div className={`p-2.5 rounded-lg ${theme.icon} backdrop-blur-sm shadow-inner`}>
                  <HeaderIcon className="w-5 h-5 2xl:w-6 2xl:h-6" />
               </div>
               <span className={`px-4 py-1.5 text-xs 2xl:text-sm font-bold tracking-widest uppercase rounded-full border backdrop-blur-md ${theme.badge}`}>
                  For {type}
               </span>
            </div>

            {/* Title & Description */}
            <h3 className={`text-2xl lg:text-3xl 2xl:text-4xl font-bold font-outfit bg-clip-text text-transparent bg-linear-to-br ${theme.title} mb-3 lg:mb-4`}>
               {role.title}
            </h3>

            <p className="text-gray-400 font-inter text-sm lg:text-base 2xl:text-[17px] leading-relaxed mb-7 lg:mb-8 2xl:mb-10">
               {role.description}
            </p>

            {/* Premium Points List */}
            <div className="mt-auto space-y-3">
               {role.points.map((point, idx) => (
                  <div key={idx} className={`flex items-center gap-4 p-3.5 2xl:p-4 rounded-lg border ${theme.listBg} backdrop-blur-sm transition-colors duration-300`}>
                     <div className="p-1 rounded-full bg-surface-dark border border-white/5 shadow-[inset_0_1px_3px_rgba(255,255,255,0.1)] shrink-0">
                        <Check className={`w-4 h-4 ${theme.check}`} strokeWidth={3} />
                     </div>
                     <span className="text-gray-200 font-inter text-sm 2xl:text-base font-medium">{point}</span>
                  </div>
               ))}
            </div>
         </div>
      </motion.div>
   )
}

export default RoleCard
