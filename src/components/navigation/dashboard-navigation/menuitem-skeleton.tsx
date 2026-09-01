import {
   SidebarGroup,
   SidebarGroupContent,
   SidebarGroupLabel,
   SidebarMenu,
   SidebarMenuItem,
} from "@/components/ui/sidebar";

const SKELETON_WIDTHS = ["w-28", "w-36", "w-32"];

const MenuItemSkeleton = () => {
   return (
      <SidebarGroup className="px-2 py-0">
         <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-wider text-zinc-600 px-3 mb-1">
            Navigation
         </SidebarGroupLabel>
         <SidebarGroupContent>
            <SidebarMenu className="gap-1.5">
               {SKELETON_WIDTHS.map((widthClass, index) => (
                  <SidebarMenuItem key={index}>
                     <div className="flex h-10 items-center gap-3 rounded-xl px-3 bg-white/2 border border-transparent">
                        <div className="size-4 rounded-md bg-zinc-800 animate-pulse shrink-0" />
                        <div className={`h-4 ${widthClass} rounded-md bg-zinc-800 animate-pulse`} />
                     </div>
                  </SidebarMenuItem>
               ))}
            </SidebarMenu>
         </SidebarGroupContent>
      </SidebarGroup>
   );
};

export default MenuItemSkeleton;
