/*
  Warnings:

  - The values [INTERVIEWEE] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `intervieweeId` on the `Booking` table. All the data in the column will be lost.
  - Added the required column `candidateId` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('UNASSIGNED', 'CANDIDATE', 'INTERVIEWER');
ALTER TABLE "public"."User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "public"."UserRole_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'UNASSIGNED';
COMMIT;

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_intervieweeId_fkey";

-- DropIndex
DROP INDEX "Booking_intervieweeId_status_idx";

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "intervieweeId",
ADD COLUMN     "candidateId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Booking_candidateId_status_idx" ON "Booking"("candidateId", "status");

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
