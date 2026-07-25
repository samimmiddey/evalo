"use client";

import { useState } from "react";

interface MutationResult<T, A extends (...args: never[]) => Promise<T>> {
   isPending: boolean;
   error: string | null;
   data: T | null;
   trigger: (...args: Parameters<A>) => Promise<void>;
}

export const useMutation = <T, A extends (...args: never[]) => Promise<T>>(
   mutationFunction: A
): MutationResult<T, A> => {
   const [isPending, setIsPending] = useState<boolean>(false);
   const [error, setError] = useState<string | null>(null);
   const [data, setData] = useState<T | null>(null);

   const trigger = async (...args: Parameters<A>) => {
      setIsPending(true);
      setError(null);
      setData(null);
      try {
         const res = await mutationFunction(...args);
         setData(res);
      } catch (error: unknown) {
         if (error instanceof Error) {
            setError(error.message);
         } else {
            setError("An unknown error occurred");
         }
      } finally {
         setIsPending(false);
      }
   };

   return { isPending, error, data, trigger };
};