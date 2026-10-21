export interface AvailabilityHeaderData {
   title: string;
   description: string;
}

export interface AvailabilityActionBarData {
   configuredTitle: string;
   addButton: string;
}

export interface SlotPreset {
   label: string;
   start: string;
   end: string;
}

export interface AddSlotModalData {
   title: string;
   description: string;
   quickPresetsLabel: string;
   dateLabel: string;
   startTimeLabel: string;
   endTimeLabel: string;
   submitButton: string;
}

export interface AvailabilityNoData {
   title: string;
   body: string;
}

export interface AvailabilityDataStatic {
   header: AvailabilityHeaderData;
   actionBar: AvailabilityActionBarData;
   slotPresets: SlotPreset[];
   addSlotModal: AddSlotModalData;
   noData: AvailabilityNoData;
}

export type AvailabilityData = AvailabilityDataStatic;
