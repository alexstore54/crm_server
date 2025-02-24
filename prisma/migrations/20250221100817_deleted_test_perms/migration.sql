/*
  Warnings:

  - You are about to drop the column `testPermissions` on the `Agent` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Agent" DROP COLUMN "testPermissions";

-- DropEnum
DROP TYPE "PermsList";
