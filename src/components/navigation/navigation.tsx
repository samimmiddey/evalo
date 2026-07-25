"use client";

import { useState } from 'react';
import Navbar from './navbar';
import Sidebar from './sidebar';
import Footer from './footer';
import { Toaster } from 'sonner';
import useScrollToTop from '@/hooks/use-scroll-to-top';

const Navigation = ({ children }: { children: React.ReactNode; }) => {
   const [sidebarOpen, setSidebarOpen] = useState(false);

   useScrollToTop();

   return (
      <div className='pt-15 2xl:pt-16'>
         <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
         <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
         {children}
         <Footer />
         <Toaster position="top-center" richColors />
      </div>
   );
};

export default Navigation;