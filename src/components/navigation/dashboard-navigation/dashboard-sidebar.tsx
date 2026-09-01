"use client";

import { DashboardSidebarMenu } from "@/components/navigation/dashboard-navigation/sidebar-menu";
import {
   Sidebar,
   SidebarContent,
   SidebarFooter,
   SidebarHeader,
} from "@/components/ui/sidebar";
import Logo from "@/components/common/logo";
import { useDashboardMenu } from "@/hooks/use-dashboard-menu";
import MenuItemSkeleton from "./menuitem-skeleton";
import CreditButton from "../common-navigation/components/credit-button";
import { useDbUser } from "@/hooks/use-db-user";
import Link from "next/link";

const DashboardSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
   const menuItems = useDashboardMenu();
   const { user } = useDbUser();

   return (
      <Sidebar
         {...props}
         collapsible="offcanvas"
         className="border-r border-white/5 **:data-[sidebar=sidebar]:bg-zinc-900/40 **:data-[sidebar=sidebar]:border-r **:data-[sidebar=sidebar]:border-white/5"
      >
         {/* Sidebar Header: Aligned height with DashboardNavbar */}
         <SidebarHeader className="h-14 px-4 border-b border-white/5 flex justify-center">
            <Link href="/" className="hover:opacity-90 transition-opacity">
               <Logo />
            </Link>
         </SidebarHeader>

         {/* Sidebar Content */}
         <SidebarContent className="py-4">
            {menuItems.length > 0 ? (
               <DashboardSidebarMenu items={menuItems} />
            ) : (
               <MenuItemSkeleton />
            )}
         </SidebarContent>

         {/* Sidebar Footer */}
         <SidebarFooter className="p-3.5 border-t border-white/5 bg-zinc-900/40">
            <div className="w-full flex flex-col gap-2">
               <CreditButton
                  role={user?.role}
                  credits={user?.role === 'INTERVIEWER' ? user?.creditBalance : user?.credits}
               />
            </div>
         </SidebarFooter>
      </Sidebar>
   );
};

export default DashboardSidebar;
