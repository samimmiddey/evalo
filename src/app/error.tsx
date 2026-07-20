"use client";

import CustomError from "@/features/special-pages/custom-error/custom-error";

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