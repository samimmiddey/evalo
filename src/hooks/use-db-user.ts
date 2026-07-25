import { getUser } from "@/services/client/user.service";
import { useFetch } from "./use-fetch";

export const useDbUser = () => {
   const result = useFetch(() => getUser());

   return {
      ...result,
      user: result.data
   };
};