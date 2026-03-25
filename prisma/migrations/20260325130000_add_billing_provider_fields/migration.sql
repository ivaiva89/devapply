-- CreateEnum
CREATE TYPE "BillingProvider" AS ENUM ('POLAR');

-- AlterTable
ALTER TABLE "User"
ADD COLUMN "billingProvider" "BillingProvider",
ADD COLUMN "billingCustomerId" TEXT,
ADD COLUMN "billingSubscriptionId" TEXT,
ADD COLUMN "billingProductId" TEXT,
ADD COLUMN "billingSubscriptionStatus" TEXT,
ADD COLUMN "billingCurrentPeriodEnd" TIMESTAMP(3),
ADD COLUMN "billingSyncedAt" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "User_billingCustomerId_key" ON "User"("billingCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "User_billingSubscriptionId_key" ON "User"("billingSubscriptionId");

-- CreateIndex
CREATE INDEX "User_billingProvider_idx" ON "User"("billingProvider");

-- CreateIndex
CREATE INDEX "User_billingProductId_idx" ON "User"("billingProductId");
