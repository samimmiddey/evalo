/*
  Warnings:

  - You are about to drop the column `categories` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "InterviewExpertise" AS ENUM ('FRONTEND', 'BACKEND', 'FULLSTACK', 'DEVOPS', 'DSA', 'SYSTEM_DESIGN', 'MOBILE', 'ML_AI', 'SECURITY', 'QA', 'CLOUD');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "categories",
ADD COLUMN     "expertise" "InterviewExpertise"[];

-- DropEnum
DROP TYPE "InterviewCategory";
