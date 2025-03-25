/*
  Warnings:

  - You are about to drop the column `userId` on the `Log` table. All the data in the column will be lost.
  - You are about to drop the column `userType` on the `Log` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Log" DROP COLUMN "userId",
DROP COLUMN "userType",
ADD COLUMN     "agentId" INTEGER;

-- DropEnum
DROP TYPE "LogUserType";
