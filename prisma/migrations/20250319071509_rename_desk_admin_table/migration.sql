/*
  Warnings:

  - You are about to drop the `DeskAdmin` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "DeskAdmin" DROP CONSTRAINT "DeskAdmin_deskId_fkey";

-- DropTable
DROP TABLE "DeskAdmin";

-- CreateTable
CREATE TABLE "LeadManager" (
    "id" SERIAL NOT NULL,
    "deskId" INTEGER NOT NULL,
    "agentId" INTEGER NOT NULL,

    CONSTRAINT "LeadManager_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LeadManager_agentId_key" ON "LeadManager"("agentId");

-- AddForeignKey
ALTER TABLE "LeadManager" ADD CONSTRAINT "LeadManager_deskId_fkey" FOREIGN KEY ("deskId") REFERENCES "Desk"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
