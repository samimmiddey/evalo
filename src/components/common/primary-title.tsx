import { cn } from '@/lib/utils'

interface PrimaryTitleProps {
   text: string
   className?: string
}

const PrimaryTitle = ({
   text,
   className,
}: PrimaryTitleProps) => {
   return (
      <h2 className={cn('font-outfit font-semibold text-3xl lg:text-[40px] 2xl:text-5xl', className)}>
         {text}
      </h2>
   )
}

export default PrimaryTitle