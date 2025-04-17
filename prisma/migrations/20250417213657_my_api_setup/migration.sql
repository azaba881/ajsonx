/*
  Warnings:

  - You are about to drop the column `isPublic` on the `Api` table. All the data in the column will be lost.
  - You are about to drop the `ApiDataSet` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `type` on the `Api` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ApiType" AS ENUM ('SIMPLE', 'RELATIONAL');

-- DropForeignKey
ALTER TABLE "ApiDataSet" DROP CONSTRAINT "ApiDataSet_apiId_fkey";

-- AlterTable
ALTER TABLE "Api" DROP COLUMN "isPublic",
ADD COLUMN     "mockData" JSONB,
DROP COLUMN "type",
ADD COLUMN     "type" "ApiType" NOT NULL;

-- DropTable
DROP TABLE "ApiDataSet";

-- CreateTable
CREATE TABLE "ApiEndpoint" (
    "id" TEXT NOT NULL,
    "path" VARCHAR(255) NOT NULL,
    "method" VARCHAR(10) NOT NULL,
    "response" JSONB NOT NULL,
    "apiId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApiEndpoint_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ApiEndpoint_apiId_idx" ON "ApiEndpoint"("apiId");

-- AddForeignKey
ALTER TABLE "ApiEndpoint" ADD CONSTRAINT "ApiEndpoint_apiId_fkey" FOREIGN KEY ("apiId") REFERENCES "Api"("id") ON DELETE CASCADE ON UPDATE CASCADE;
