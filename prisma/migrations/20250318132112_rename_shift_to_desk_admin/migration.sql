/*
  Warnings:

  - You are about to drop the `Shift` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Shift" DROP CONSTRAINT "Shift_deskId_fkey";

-- DropTable
DROP TABLE "Shift";

-- CreateTable
CREATE TABLE "DeskAdmin" (
    "id" SERIAL NOT NULL,
    "deskId" INTEGER NOT NULL,
    "agentId" INTEGER NOT NULL,

    CONSTRAINT "DeskAdmin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DeskAdmin_agentId_key" ON "DeskAdmin"("agentId");

-- AddForeignKey
ALTER TABLE "DeskAdmin" ADD CONSTRAINT "DeskAdmin_deskId_fkey" FOREIGN KEY ("deskId") REFERENCES "Desk"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
