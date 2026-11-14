-- AlterEnum
ALTER TYPE "PayoutStatus" ADD VALUE 'EXPIRED';

-- AlterTable
ALTER TABLE "Payout" ADD COLUMN     "cashgramId" TEXT,
ADD COLUMN     "cashgramUrl" TEXT;
