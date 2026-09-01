"use client";

import { useEffect, useState } from "react";
import { useInfiniteFetch } from "@/hooks/use-infinite-fetch";
import { usePaginationTrigger } from "@/hooks/use-pagination-trigger";
import useDebounce from "@/hooks/use-debounce";
import useView from "@/hooks/use-view";
import useMediaQuery from "@/hooks/use-media-query";
import { getDashboardSessions } from "../../services/dashboard.client.service";
import {
   DashboardSession,
   SessionFeedback,
   SessionsFilterParams
} from "../../types/dashboard.types";
import SessionCard from "./session-card";
import { FeedbackModal } from "@/features/interviews/shared/modal/feedback-modal";
import { DashboardContentSkeleton } from "../skeletons/dashboard-content-skeleton";
import EnhancedNoDataCard from "@/components/common/enhanced-no-data-card";
import SearchBar from "@/components/common/search-bar";
import CustomTooltip from "@/components/common/custom-tooltip";
import ListEndMessage from "@/components/common/list-end-message";
import { Button } from "@/components/ui/button";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue
} from "@/components/ui/select";
import { toast } from "sonner";
import { Grid2x2, Rows3 } from "lucide-react";

const statusFilterOptions: { label: string; value: SessionsFilterParams["status"]; }[] = [
   { label: "All Sessions", value: "ALL" },
   { label: "Scheduled", value: "SCHEDULED" },
   { label: "Completed", value: "COMPLETED" },
   { label: "Cancelled", value: "CANCELLED" }
];

export const SessionsView = () => {
   const [statusFilter, setStatusFilter] = useState<SessionsFilterParams["status"]>("ALL");
   const [searchQuery, setSearchQuery] = useState("");
   const debouncedSearch = useDebounce(searchQuery, 500);

   const { view, setView } = useView("list");
   const lgWidth = useMediaQuery(1024);

   const [selectedFeedback, setSelectedFeedback] = useState<{
      feedback: SessionFeedback;
      candidateName: string;
   } | null>(null);

   const {
      isLoading,
      isFetchingNextPage,
      data: sessions,
      error,
      hasNextPage,
      fetchNextPage
   } = useInfiniteFetch<DashboardSession>(
      (page) =>
         getDashboardSessions({
            status: statusFilter,
            search: debouncedSearch,
            page,
            pageSize: 10
         }),
      [statusFilter, debouncedSearch]
   );

   const { ref: sentinelRef } = usePaginationTrigger({
      onIntersect: fetchNextPage,
      enabled: hasNextPage,
      isFetching: isFetchingNextPage
   });

   useEffect(() => {
      if (error) {
         toast.error(error);
      }
   }, [error]);

   return (
      <div>
         {/* Filter and Search Bar */}
         <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 lg:gap-3 2xl:gap-4 p-2 bg-zinc-900/40 border border-white/5 rounded-xl mb-7 2xl:mb-8 relative z-10 backdrop-blur-xl">
            {/* Status Filter Dropdown */}
            <Select
               value={statusFilter}
               onValueChange={(val) => setStatusFilter(val as SessionsFilterParams["status"])}
            >
               <SelectTrigger className="h-10! w-full sm:w-48 bg-zinc-900 border-white/10 text-zinc-200">
                  <SelectValue placeholder="All Sessions" />
               </SelectTrigger>
               <SelectContent className="bg-zinc-900 border-white/10 text-zinc-200">
                  {statusFilterOptions.map((opt) => (
                     <SelectItem key={opt.value} value={opt.value ?? "ALL"}>
                        {opt.label}
                     </SelectItem>
                  ))}
               </SelectContent>
            </Select>

            {/* Candidate Search & Grid/List View Switcher */}
            <div className="flex items-center gap-2.5 w-full sm:w-86 2xl:w-90">
               <SearchBar
                  value={searchQuery}
                  setValue={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search candidates..."
                  showLabel={false}
                  inputClassName="h-10!"
               />
               {!lgWidth && (
                  <CustomTooltip
                     trigger={
                        <Button
                           onClick={() => setView(view === "grid" ? "list" : "grid")}
                           variant="outline"
                           className="w-fit shrink-0 h-10! bg-zinc-900 hover:bg-zinc-800 border-white/10 text-zinc-100 cursor-pointer"
                        >
                           {view === "list" ? (
                              <Rows3 className="w-4 h-4" />
                           ) : (
                              <Grid2x2 className="w-4 h-4" />
                           )}
                        </Button>
                     }
                     content={`View ${view === "list" ? "Grid" : "List"}`}
                  />
               )}
            </div>
         </div>

         {/* Sessions Content */}
         {isLoading ? (
            <DashboardContentSkeleton view={view} />
         ) : sessions && sessions.length > 0 ? (
            <>
               <div className={view === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-5 2xl:gap-6" : "grid grid-cols-1 gap-5 2xl:gap-6"}>
                  {sessions.map((session) => (
                     <SessionCard
                        key={session.id}
                        session={session}
                        view={view}
                        onViewFeedback={(feedback, candidateName) =>
                           setSelectedFeedback({ feedback, candidateName })
                        }
                     />
                  ))}
               </div>

               {/* Loading more state */}
               {isFetchingNextPage && (
                  <div className="mt-5 2xl:mt-6">
                     <DashboardContentSkeleton view={view} count={2} />
                  </div>
               )}

               {/* End of list state */}
               {!hasNextPage && sessions.length > 0 && (
                  <div className="mt-8 2xl:mt-10">
                     <ListEndMessage text="You've reached the end of the list" />
                  </div>
               )}

               {/* Pagination trigger sentinel */}
               <div ref={sentinelRef} className="h-6" />
            </>
         ) : (
            <EnhancedNoDataCard
               title="No Sessions Found"
               body={
                  statusFilter === "SCHEDULED"
                     ? "You have no upcoming scheduled sessions. Set your availability slots so interviewees can book sessions with you."
                     : "No session records match your selected filters."
               }
            />
         )}

         {/* Feedback Viewer Modal */}
         {selectedFeedback && (
            <FeedbackModal
               open={selectedFeedback !== null}
               onClose={() => setSelectedFeedback(null)}
               feedback={selectedFeedback.feedback}
               candidateName={selectedFeedback.candidateName}
            />
         )}
      </div>
   );
};

export default SessionsView;
