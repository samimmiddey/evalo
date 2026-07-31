-- AlterTable
ALTER TABLE "User" ADD COLUMN     "averageRating" DOUBLE PRECISION,
ADD COLUMN     "totalRatings" INTEGER NOT NULL DEFAULT 0;
