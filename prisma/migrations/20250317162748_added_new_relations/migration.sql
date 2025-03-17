/*
  Warnings:

  - A unique constraint covering the columns `[publicId]` on the table `Lead` will be added. If there are existing duplicate values, this will fail.
  - The required column `publicId` was added to the `Lead` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `deskId` to the `Team` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Desk" ADD COLUMN     "shiftIds" INTEGER[];

-- AlterTable
ALTER TABLE "Lead" ADD COLUMN     "publicId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "deskId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Lead_publicId_key" ON "Lead"("publicId");

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_deskId_fkey" FOREIGN KEY ("deskId") REFERENCES "Desk"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
