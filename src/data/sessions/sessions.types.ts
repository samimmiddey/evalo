import { SessionsFilterParams } from "@/features/interviews/sessions/types/session.types";

export interface SessionsHeaderData {
   title: string;
   description: string;
}

export interface SessionsStatusFilterOption {
   label: string;
   value: SessionsFilterParams["status"];
}

export interface SessionsSearchData {
   placeholder: string;
}

export interface SessionsNoData {
   title: string;
   scheduledBody: string;
   defaultBody: string;
}

export interface HelpfulTips {
   header: string;
   body: string[];
}

export interface SessionsDataStatic {
   header: SessionsHeaderData;
   statusFilterOptions: SessionsStatusFilterOption[];
   search: SessionsSearchData;
   noData: SessionsNoData;
   helpfulTips: HelpfulTips;
}

export type SessionsData = SessionsDataStatic;
