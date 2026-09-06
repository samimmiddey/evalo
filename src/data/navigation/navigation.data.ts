import { FooterDataTypes, NavigationItem } from "./navigation.types";
import { HomeIcon, UserRound, StarIcon, TagIcon } from "lucide-react";

export const navigationData: NavigationItem[] = [
   {
      name: "Home",
      href: "/",
      icon: HomeIcon
   },
   {
      name: "About",
      href: "/about",
      icon: StarIcon
   },
   {
      name: "Pricing",
      href: "/pricing",
      icon: TagIcon
   },
   {
      name: "Contact",
      href: "/contact",
      icon: UserRound
   }
];

export const footerData: FooterDataTypes = {
   description: "Evaluate talent with clarity and confidence. The best platform for modern technical interviews and talent assessment.",
   columns: [
      {
         title: "Product",
         links: [
            { name: "About", href: "/#about" },
            { name: "Pricing", href: "/#pricing" },
            { name: "Testimonials", href: "/#testimonials" },
         ]
      },
      {
         title: "Company",
         links: [
            { name: "About Us", href: "/about" },
            { name: "Careers", href: "/careers" },
            { name: "Contact", href: "/contact" },
         ]
      }
   ],
   copyright: `© ${new Date().getFullYear()} Evalo. All rights reserved.`,
   socials: [
      { icon: 'twitter', href: '' },
      { icon: 'github', href: '' },
      { icon: 'linkedin', href: '' }
   ]
};