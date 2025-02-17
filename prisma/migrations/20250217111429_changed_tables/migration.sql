/*
  Warnings:

  - You are about to drop the column `user_id` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Email` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Leads` table. All the data in the column will be lost.
  - You are about to drop the `Team` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_AgentTeams` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[status_id]` on the table `Leads` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `last_time_online` to the `Agent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Agent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_time_online` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status_id` to the `Leads` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Agent" DROP CONSTRAINT "Agent_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Customer" DROP CONSTRAINT "Customer_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Email" DROP CONSTRAINT "Email_user_id_fkey";

-- DropForeignKey
ALTER TABLE "_AgentTeams" DROP CONSTRAINT "_AgentTeams_A_fkey";

-- DropForeignKey
ALTER TABLE "_AgentTeams" DROP CONSTRAINT "_AgentTeams_B_fkey";

-- DropIndex
DROP INDEX "Customer_user_id_key";

-- AlterTable
ALTER TABLE "Agent" ADD COLUMN     "last_time_online" TIMESTAMPTZ(0) NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "user_id",
ADD COLUMN     "last_time_online" TIMESTAMPTZ(0) NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Email" DROP COLUMN "createdAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Leads" DROP COLUMN "phone",
ADD COLUMN     "country" TEXT,
ADD COLUMN     "status_id" INTEGER NOT NULL,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ(0);

-- AlterTable
ALTER TABLE "Log" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ(0);

-- AlterTable
ALTER TABLE "Role" ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "name" DROP DEFAULT;

-- DropTable
DROP TABLE "Team";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "_AgentTeams";

-- CreateTable
CREATE TABLE "Phone" (
    "id" SERIAL NOT NULL,
    "phone" TEXT NOT NULL,
    "isMain" BOOLEAN NOT NULL DEFAULT false,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Phone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadStatus" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "LeadStatus_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Leads_status_id_key" ON "Leads"("status_id");

-- AddForeignKey
ALTER TABLE "Leads" ADD CONSTRAINT "Leads_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "LeadStatus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Email" ADD CONSTRAINT "Email_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Phone" ADD CONSTRAINT "Phone_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Leads"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
