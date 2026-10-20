import type { Metadata } from "next";
import { PAGE_METADATA } from "@/constants/metadata";
import Billing from "@/features/interviews/billing/billing";

export const metadata: Metadata = PAGE_METADATA.billing;

const BillingPage = () => {
   return (
      <Billing />
   );
};

export default BillingPage;
