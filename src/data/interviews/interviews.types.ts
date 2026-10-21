export interface SectionHeader {
   title: string;
   description: string;
}

export interface SlotPreset {
   label: string;
   start: string;
   end: string;
}

export interface InterviewerData {
   sessions: SectionHeader;
   availability: SectionHeader;
   profile: SectionHeader;
   slotPresets: SlotPreset[];
}