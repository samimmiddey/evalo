import type { Metadata } from "next";
import { PAGE_METADATA } from "@/constants/metadata";
import Availability from "@/features/interviews/availability/availability";

export const metadata: Metadata = PAGE_METADATA.availability;

const AvailabilityPage = () => {
   return <Availability />;
};

export default AvailabilityPage;
