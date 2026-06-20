import HeaderText from '@/components/common/header-text'
import PrimaryBody from '@/components/common/primary-body'
import PrimaryTitle from '@/components/common/primary-title'
import HeaderLayout from '@/components/layouts/header-layout'
import { Zap } from 'lucide-react'

const Features = () => {
   return (
      <div className='s-margin-t container'>
         <HeaderLayout>
            <HeaderText
               icon={Zap}
               text='Built for Excellence'
            />
            <PrimaryTitle text="Everything You Need to Succeed" className='mt-1 2xl:mt-2' />
            <PrimaryBody
               text="Practice and complete interviews easily with structured assessments, clear instructions, and real-time feedback designed to help you improve."
            />
         </HeaderLayout>
      </div>
   )
}

export default Features