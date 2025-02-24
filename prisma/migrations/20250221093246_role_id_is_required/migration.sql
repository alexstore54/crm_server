/*
  Warnings:

  - Made the column `roleId` on table `Agent` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Agent" DROP CONSTRAINT "Agent_roleId_fkey";

-- AlterTable
ALTER TABLE "Agent" ALTER COLUMN "roleId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Agent" ADD CONSTRAINT "Agent_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
