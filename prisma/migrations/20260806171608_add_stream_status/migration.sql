-- CreateEnum
CREATE TYPE "StreamStatus" AS ENUM ('READY', 'PENDING', 'FAILED');

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "streamStatus" "StreamStatus" NOT NULL DEFAULT 'READY';
