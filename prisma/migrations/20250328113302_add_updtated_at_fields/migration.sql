/*
  Warnings:

  - Added the required column `updatedAt` to the `Agent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Lead` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Agent" ADD COLUMN     "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMPTZ(0) NOT NULL;

-- AlterTable
ALTER TABLE "Lead" ADD COLUMN     "updatedAt" TIMESTAMPTZ(0) NOT NULL;
