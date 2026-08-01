export type ExpertiseEnum = 'DATA_SCIENCE' | 'MACHINE_LEARNING' | 'LEADERSHIP' | 'UI_UX' | 'FRONTEND' | 'BACKEND' | 'SYSTEM_DESIGN' | 'MOBILE';

export type ExperienceEnum = '0-2' | '3-5' | '6-9' | '10+';

export interface Expertise {
   label: string;
   value: ExpertiseEnum;
}

export interface Experience {
   label: string;
   value: ExperienceEnum;
}

export interface Header {
   title: string;
   description: string;
}

export interface ExploreData {
   header: Header;
   expertise: Expertise[];
   experience: Experience[];
}