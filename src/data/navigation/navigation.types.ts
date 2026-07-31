import { LucideIcon } from "lucide-react";

export interface NavigationItem {
   name: string;
   href: string;
   icon?: LucideIcon;
}

export interface FooterColumn {
   title: string;
   links: NavigationItem[];
}

export interface FooterDataTypes {
   description: string;
   columns: FooterColumn[];
   copyright: string;
   socials?: { icon: string, href: string; }[];
}