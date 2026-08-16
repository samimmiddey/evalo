import { Prisma } from "@/generated/prisma/client";

const isDev = process.env.NODE_ENV === 'development';

interface ServerErrorProps {
   error: unknown;
   fallbackMessage?: string;
}

export const serverError = ({ error, fallbackMessage = "Something went wrong" }: ServerErrorProps): never => {
   if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
         case 'P2025':
            throw new Error("We couldn't find the requested record");
         case 'P2002':
            throw new Error("A record with this value already exists");
         case 'P2003':
            throw new Error("This action references a record that doesn't exist");
         default:
            throw new Error(fallbackMessage);
      }
   }

   if (error instanceof Prisma.PrismaClientValidationError) {
      throw new Error("Invalid data provided");
   }

   if (error instanceof Error) {
      throw new Error(isDev ? error.message : fallbackMessage);
   }

   throw new Error(fallbackMessage);
};