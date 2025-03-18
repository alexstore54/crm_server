/*
  Warnings:

  - You are about to drop the column `shiftIds` on the `Desk` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Desk" DROP COLUMN "shiftIds";

-- CreateTable
CREATE TABLE "Shift" (
    "id" SERIAL NOT NULL,
    "deskId" INTEGER NOT NULL,
    "agentId" INTEGER NOT NULL,

    CONSTRAINT "Shift_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Shift_agentId_key" ON "Shift"("agentId");

-- AddForeignKey
ALTER TABLE "Shift" ADD CONSTRAINT "Shift_deskId_fkey" FOREIGN KEY ("deskId") REFERENCES "Desk"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
