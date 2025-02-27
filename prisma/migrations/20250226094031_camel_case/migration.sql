/*
  Warnings:

  - You are about to drop the column `lead_id` on the `Phone` table. All the data in the column will be lost.
  - Added the required column `leadId` to the `Phone` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Phone" DROP CONSTRAINT "Phone_lead_id_fkey";

-- AlterTable
ALTER TABLE "Lead" ALTER COLUMN "firstname" DROP NOT NULL,
ALTER COLUMN "lastname" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Phone" DROP COLUMN "lead_id",
ADD COLUMN     "leadId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Phone" ADD CONSTRAINT "Phone_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
