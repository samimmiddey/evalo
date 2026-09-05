import {
   UserStar,
   LayoutDashboard,
   CalendarDays,
   Video,
   Clock,
   Wallet,
   SlidersHorizontal,
} from 'lucide-react';
import { NavigationItem } from "./navigation.types";

export const intervieweeNavigationData: NavigationItem[] = [
   {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard
   },
   {
      name: 'Explore Interviewers',
      href: '/dashboard/interviewers',
      icon: UserStar
   },
   {
      name: 'Appointments',
      href: '/dashboard/appointments',
      icon: CalendarDays
   }
];

export const interviewerNavigationData: NavigationItem[] = [
   {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard
   },
   {
      name: 'Sessions',
      href: '/dashboard/sessions',
      icon: Video
   },
   {
      name: 'Availability',
      href: '/dashboard/availability',
      icon: Clock
   },
   {
      name: 'Earnings & Payouts',
      href: '/dashboard/payouts',
      icon: Wallet
   },
   {
      name: 'Profile Settings',
      href: '/dashboard/profile',
      icon: SlidersHorizontal
   }
];