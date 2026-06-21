import { FooterDataTypes, NavigationItem } from "./navigation.types";

export const navigationData: NavigationItem[] = [
   {
      name: "Home",
      href: "/",
   },
   {
      name: "Featured",
      href: "/featured",
   },
   {
      name: "Pricing",
      href: "/pricing",
   },
   {
      name: "Contact",
      href: "/contact",
   }
]

export const footerData: FooterDataTypes = {
   description: "Evaluate talent with clarity and confidence. The best platform for modern technical interviews and talent assessment.",
   columns: [
      {
         title: "Product",
         links: [
            { name: "Features", href: "/#features" },
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
}