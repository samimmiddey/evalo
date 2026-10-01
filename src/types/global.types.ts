import { BaseResponse } from "./api.types";

export interface Config {
   id: string;
   creditPayoutRate: number;
   platformFeePercent: number;
   minPayoutCredits: number;
   currency: string;
}

export type ConfigResponse = BaseResponse<Config>;