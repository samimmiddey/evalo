export interface ProfileHeaderData {
   title: string;
   description: string;
}

export interface ProfileFormCardData {
   title: string;
   description: string;
}

export interface ProfileFieldData {
   label: string;
   placeholder?: string;
}

export interface ProfileFieldsData {
   designation: ProfileFieldData;
   company: ProfileFieldData;
   experience: ProfileFieldData;
   expertise: ProfileFieldData;
   bio: ProfileFieldData;
}

export interface ProfileDataStatic {
   header: ProfileHeaderData;
   formCard: ProfileFormCardData;
   fields: ProfileFieldsData;
   submitButton: string;
}

export type ProfileData = ProfileDataStatic;
