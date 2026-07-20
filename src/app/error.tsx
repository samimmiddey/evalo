"use client";

import CustomError from "@/features/custom-error/custom-error";

export default function ErrorPage({
   error,
   reset,
}: {
   error: Error & { digest?: string; };
   reset: () => void;
}) {
   return (
      <CustomError
         error={error}
         reset={reset}
      />
   );
}