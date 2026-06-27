"use client"

import { useState } from 'react'
import Navbar from './navbar'
import Sidebar from './sidebar'
import Footer from './footer'
import { Toaster } from 'sonner';

const Navigation = ({ children }: { children: React.ReactNode }) => {
   const [sidebarOpen, setSidebarOpen] = useState(false)

   return (
      <div className='pt-15 2xl:pt-16'>
         <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
         <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
         {children}
         <Footer />
         <Toaster position="top-center" richColors />
      </div>
   )
}

export default Navigation