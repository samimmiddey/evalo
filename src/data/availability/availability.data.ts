import { AvailabilityDataStatic } from "./availability.types";

export const availabilityData: AvailabilityDataStatic = {
   header: {
      title: "Availability",
      description: "Set your weekly recurring time slots so candidates can book mock interview sessions with you."
   },
   actionBar: {
      configuredTitle: "Configured Slots",
      addButton: "Add Slots"
   },
   slotPresets: [
      { label: "Morning (09:00 AM - 12:00 PM)", start: "09:00", end: "12:00" },
      { label: "Afternoon (02:00 PM - 05:00 PM)", start: "14:00", end: "17:00" },
      { label: "Evening (06:00 PM - 09:00 PM)", start: "18:00", end: "21:00" }
   ],
   addSlotModal: {
      title: "Add Availability Slots",
      description: "Choose a date and time window. The scheduler will automatically split your window into bookable slots.",
      quickPresetsLabel: "Quick Presets",
      dateLabel: "Date",
      startTimeLabel: "Start Time",
      endTimeLabel: "End Time",
      submitButton: "Add Slots"
   },
   noData: {
      title: "No Availability Configured",
      body: "You haven't set any availability slots yet. Add your available hours so candidates can schedule mock technical interviews."
   }
};
