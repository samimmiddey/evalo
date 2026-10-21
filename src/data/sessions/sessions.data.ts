import { SessionsDataStatic } from "./sessions.types";

export const sessionsData: SessionsDataStatic = {
   header: {
      title: "Sessions",
      description: "Manage and review your upcoming mock interviews and review completed session feedback."
   },
   statusFilterOptions: [
      { label: "All Sessions", value: "ALL" },
      { label: "Scheduled", value: "SCHEDULED" },
      { label: "Completed", value: "COMPLETED" },
      { label: "Cancelled", value: "CANCELLED" }
   ],
   search: {
      placeholder: "Search candidates..."
   },
   noData: {
      title: "No Sessions Found",
      scheduledBody: "You have no upcoming scheduled sessions. Set your availability slots so candidates can book sessions with you.",
      defaultBody: "No session records match your selected filters."
   },
   helpfulTips: {
      header: "Session Guidelines",
      body: [
         "Room opens 10 minutes early to test equipment and review candidate details.",
         "The interview room remains accessible until the scheduled end time.",
         "Reconnections and network drops are automatically merged into total co-presence time.",
         "Earn full session credits upon completing at least 50% of the booked time together.",
         "Concluding the call as host immediately finalizes and settles the session.",
         "Unattended sessions expire with 0 credits earned and a full candidate refund.",
         "On candidate no-shows, staying until the slot ends guarantees full compensation"
      ]
   }
};
