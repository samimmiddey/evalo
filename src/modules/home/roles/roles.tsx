"use client"

import HeaderText from '@/components/common/header-text'
import PrimaryBody from '@/components/common/primary-body'
import PrimaryTitle from '@/components/common/primary-title'
import HeaderLayout from '@/components/layouts/header-layout'
import { homeData } from '@/data/home/home.data'
import RoleCard from './components/role-card'

const Roles = () => {
   return (
      <div className='s-margin-t container'>
         <HeaderLayout>
            <HeaderText
               icon={homeData.roles.icon}
               text={homeData.roles.header}
            />
            <PrimaryTitle text={homeData.roles.title} className='mt-1 2xl:mt-2' />
            <PrimaryBody
               text={homeData.roles.description}
            />
         </HeaderLayout>

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 2xl:gap-8 w-full">
            <RoleCard i={0} role={homeData.roles.interviewee} type="Interviewees" />
            <RoleCard i={1} role={homeData.roles.interviewer} type="Interviewers" />
         </div>
      </div>
   )
}

export default Roles