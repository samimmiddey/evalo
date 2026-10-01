"use client";

import { getPlatformConfig } from "@/services/client/global.client.service";
import { useFetch } from "./use-fetch";

export const usePlatformConfig = () => {
   const { data: config, ...rest } = useFetch(getPlatformConfig);

   return {
      config,
      ...rest
   };
};