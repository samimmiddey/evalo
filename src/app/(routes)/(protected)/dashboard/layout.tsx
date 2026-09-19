import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/navigation/dashboard-navigation/dashboard-sidebar";
import DashboardNavbar from "@/components/navigation/dashboard-navigation/dashboard-navbar";
import UpgradeModal from "@/components/common/upgrade-modal";

export default function DashboardLayout({ children }: { children: React.ReactNode; }) {
   return (
      <SidebarProvider>
         <DashboardSidebar />
         <UpgradeModal />
         <main className="flex flex-col flex-1 w-full min-w-0 min-h-screen">
            <DashboardNavbar />
            <div className="flex-1 w-full sm:px-4">
               {children}
            </div>
         </main>
      </SidebarProvider>
   );
}