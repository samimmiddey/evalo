"use client"

import { useState } from 'react'
import Navbar from './navbar'
import Sidebar from './sidebar'

const Navigation = ({ children }: { children: React.ReactNode }) => {
   const [sidebarOpen, setSidebarOpen] = useState(false)

   return (
      <div className='pt-15 2xl:pt-16'>
         <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
         <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
         {children}
      </div>
   )
}

export default Navigation