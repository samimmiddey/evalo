"use client";

import CardLayout from "@/components/layouts/card-layout";
import SecondaryTitle from "@/components/common/secondary-title";
import PrimaryBody from "@/components/common/primary-body";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowRight, Video, CalendarCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { format, formatDistanceToNow, isPast } from "date-fns";

export interface SessionCounterpart {
   name: string;
   imageUrl?: string | null;
   fallbackInitial?: string;
   subtitle: string;
}

export interface DashboardSessionData {
   startTime: string | Date;
   streamCallId?: string | null;
   counterpart: SessionCounterpart;
}

interface DashboardSessionCardProps {
   title: string;
   session?: DashboardSessionData | null;
   viewAllHref: string;
   viewAllLabel: string;
   manageLabel: string;
   emptyTitle: string;
   emptyDescription: string;
}

export const DashboardSessionCard = ({
   title,
   session,
   viewAllHref,
   viewAllLabel,
   manageLabel,
   emptyTitle,
   emptyDescription,
}: DashboardSessionCardProps) => {
   return (
      <CardLayout className="p-6! space-y-5 relative overflow-hidden">
         {/* Card Header */}
         <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
               <SecondaryTitle
                  text={title}
                  className="text-base! font-semibold! text-zinc-100!"
               />
            </div>
            {session && (
               <Badge
                  variant="outline"
                  className="bg-violet-500/10 border-violet-500/30 text-violet-300 text-xs px-2.5 py-0.5"
               >
                  {isPast(new Date(session.startTime))
                     ? "In progress"
                     : `Starts ${formatDistanceToNow(new Date(session.startTime), { addSuffix: true })}`}
               </Badge>
            )}
         </div>

         {session ? (
            <div className="space-y-4">
               {/* Counterpart Details Box */}
               <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-white/2 border border-white/5">
                  <div className="flex items-center gap-3.5">
                     <div className="relative size-12 rounded-full overflow-hidden border border-white/10 bg-zinc-800 shrink-0">
                        {session.counterpart.imageUrl ? (
                           <Image
                              src={session.counterpart.imageUrl}
                              alt={session.counterpart.name}
                              fill
                              sizes="48px"
                              className="object-cover"
                           />
                        ) : (
                           <div className="size-full flex items-center justify-center text-zinc-400 font-bold">
                              {session.counterpart.fallbackInitial ?? session.counterpart.name?.[0] ?? "U"}
                           </div>
                        )}
                     </div>

                     <div className="space-y-1">
                        <SecondaryTitle
                           text={session.counterpart.name}
                           className="text-sm! font-semibold! text-zinc-100!"
                        />
                        <PrimaryBody
                           text={session.counterpart.subtitle}
                           className="text-xs! lg:text-xs! 2xl:text-xs! text-zinc-400!"
                        />
                     </div>
                  </div>

                  {/* Scheduled Date/Time */}
                  <div className="flex items-center gap-3 text-xs text-zinc-300 bg-zinc-900/60 px-3 py-2 rounded-lg border border-white/5">
                     <div className="flex items-center gap-1.5 text-violet-300 font-medium">
                        <Calendar className="size-3.5 text-violet-400" />
                        <span>{format(new Date(session.startTime), "EEE, MMM d")}</span>
                     </div>
                     <div className="h-3 w-px bg-white/10" />
                     <div className="flex items-center gap-1.5 text-zinc-400 font-medium">
                        <Clock className="size-3.5 text-zinc-500" />
                        <span>{format(new Date(session.startTime), "hh:mm a")}</span>
                     </div>
                  </div>
               </div>

               {/* Action Footer */}
               <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <Link href={viewAllHref} className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors flex items-center gap-1">
                     <span>{viewAllLabel}</span>
                     <ArrowRight className="size-3" />
                  </Link>

                  {session.streamCallId ? (
                     <Link href={`/call/${session.streamCallId}`} className="max-sm:w-full">
                        <Button className="cursor-pointer bg-violet-600 hover:bg-violet-700 text-zinc-100 text-xs rounded-lg h-9 px-4.5 font-semibold shadow-lg hover:shadow-violet-600/10 flex items-center gap-1.5 max-sm:w-full">
                           <Video className="w-3.5 h-3.5" />
                           <span>Join Interview</span>
                        </Button>
                     </Link>
                  ) : (
                     <Link href={viewAllHref} className="max-sm:w-full">
                        <Button
                           variant="outline"
                           className="cursor-pointer border-white/5 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 text-xs rounded-lg h-9 px-4.5 flex items-center gap-1.5 max-sm:w-full"
                        >
                           <span>{manageLabel}</span>
                        </Button>
                     </Link>
                  )}
               </div>
            </div>
         ) : (
            /* Empty State */
            <div className="text-center py-6 space-y-4">
               <div className="size-10 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center mx-auto">
                  <CalendarCheck className="size-5" />
               </div>
               <div className="space-y-1 max-w-sm mx-auto">
                  <SecondaryTitle
                     text={emptyTitle}
                     className="text-sm! font-semibold! text-zinc-200!"
                  />
                  <PrimaryBody
                     text={emptyDescription}
                     className="text-xs! lg:text-xs! 2xl:text-xs! text-zinc-400! leading-relaxed"
                  />
               </div>
            </div>
         )}
      </CardLayout>
   );
};

export default DashboardSessionCard;
