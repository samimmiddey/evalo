import InterviewCardSkeleton from "@/features/interviews/appointments/components/skeletons/interview-card-skeleton";
import { ViewType } from "@/types/ui.types";

interface DashboardContentSkeletonProps {
   view?: ViewType;
   count?: number;
}

export const DashboardContentSkeleton = ({
   view = "list",
   count = 4
}: DashboardContentSkeletonProps) => {
   return (
      <div
         className={`grid gap-5 2xl:gap-6 w-full ${view === "list" ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"
            }`}
      >
         {Array.from({ length: count }).map((_, i) => (
            <InterviewCardSkeleton key={i} view={view} />
         ))}
      </div>
   );
};

export default DashboardContentSkeleton;
