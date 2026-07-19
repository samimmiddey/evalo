"use client";

import { AlertOctagon, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import PrimaryTitle from "@/components/common/primary-title";
import PrimaryBody from "@/components/common/primary-body";

const CustomError = ({
   error,
   reset,
}: {
   error: Error & { digest?: string; };
   reset: () => void;
}) => {
   return (
      <div className="container">
         <div className="flex min-h-[75vh] w-full md:max-w-[650px] 2xl:max-w-[800px] flex-col items-center justify-center text-center mx-auto">
            <div className="mb-6 flex size-20 2xl:size-24 items-center justify-center rounded-full bg-destructive/10">
               <AlertOctagon className="size-10 2xl:size-12 text-destructive" />
            </div>
            <div className="flex flex-col gap-4 2xl:gap-5 mb-6.5 2xl:mb-8">
               <PrimaryTitle text='Oops! Something went wrong' />
               <PrimaryBody text={error.message || "We encountered an unexpected error while processing your request. Please try again."} />
            </div>
            <div className="flex items-center gap-3 2xl:gap-4 flex-row">
               <Button onClick={() => reset()} size="lg" className="gap-2 w-auto">
                  <RotateCw className="size-4" />
                  Try Again
               </Button>
               <Button
                  variant="outline"
                  size="lg"
                  className="w-auto"
                  onClick={() => window.location.href = '/'}
               >
                  Go to Homepage
               </Button>
            </div>
         </div>
      </div>
   );
};

export default CustomError;