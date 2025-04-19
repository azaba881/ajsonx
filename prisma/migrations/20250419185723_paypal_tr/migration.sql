/*
  Warnings:

  - You are about to drop the column `paypalPlanId` on the `Plan` table. All the data in the column will be lost.
  - You are about to drop the column `paypalSubscriptionId` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Plan" DROP COLUMN "paypalPlanId";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "paypalSubscriptionId";
