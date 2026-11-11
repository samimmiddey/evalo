import { GlobalTypes } from "./global.types";

export const globalData: GlobalTypes = {
   statusBadges: {
      success: "Successful",
      failed: "Failed",
      pending: "Pending",
      processing: "Processing",
      processed: "Processed",
      rejected: "Rejected",
      cancelled: "Cancelled",
      active: "Active",
      completed: "Completed",
      onHold: "On Hold",
      scheduled: "Scheduled",
      expired: "Expired",
      bankPending: "Bank Pending",
      free: "Free",
      paused: "Paused"
   },
   tableNoData: {
      title: "No records found",
      body: "There are no entries to display at this time. Once data becomes available, it will appear here."
   }
};