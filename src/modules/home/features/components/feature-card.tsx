import React from 'react'
import { motion } from 'motion/react'

interface FeatureCardProps {
   i: number
   feature: { title: string, description: string }
   Icon: React.ElementType
   className?: string
}

const FeatureCard = ({ i, feature, Icon, className }: FeatureCardProps) => {
   return (
      <motion.div
         key={i}
         initial={{ opacity: 0, y: 20 }}
         whileInView={{ opacity: 1, y: 0 }}
         viewport={{ once: true, margin: "-50px", amount: 0.1 }}
         transition={{ duration: 0.5, delay: i * 0.1, ease: 'easeOut' }}
         className={`group relative p-7 lg:p-8 2xl:p-9 rounded-3xl bg-surface-dark/80 border border-violet-500/25 overflow-hidden transition-all duration-300 hover:translate-y-[-5px] hover:border-violet-500/50 hover:bg-surface-hover/90 hover:shadow-glow-violet ${className ?? ""}`}
      >
         {/* Background Glow */}
         <div className="absolute top-0 right-0 w-40 h-40 bg-violet-500/20 rounded-full blur-3xl group-hover:bg-violet-500/50 transition-colors duration-500" />

         {/* Icon Container */}
         <div className="relative z-10 mb-5 2xl:mb-6 inline-flex p-2.5 lg:p-3 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-400 group-hover:text-violet-300 group-hover:border-violet-400/50 group-hover:bg-violet-500/20 transition-all duration-300 shadow-sm">
            <Icon className="h-5 2xl:w-6 w-5 2xl:h-6" />
         </div>

         <div className="relative z-10">
            <h3 className="text-lg 2xl:text-xl font-semibold font-outfit text-gray-100 mb-2.5 2xl:mb-3 group-hover:text-white transition-colors duration-300">
               {feature.title}
            </h3>
            <p className="text-gray-400 font-inter text-sm 2xl:text-[15px] leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
               {feature.description}
            </p>
         </div>
      </motion.div>
   )
}

export default FeatureCard