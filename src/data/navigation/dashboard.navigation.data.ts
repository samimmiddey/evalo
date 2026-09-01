import { UserStar, LayoutDashboard, CalendarDays } from 'lucide-react';
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
      icon: UserStar
   }
];