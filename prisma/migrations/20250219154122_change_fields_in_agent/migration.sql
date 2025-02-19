/*
  Warnings:

  - You are about to drop the column `testRoles` on the `Agent` table. All the data in the column will be lost.
  - The primary key for the `Log` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Log` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "RouteAccess" AS ENUM ('ADMIN', 'MODERATOR');

-- AlterTable
ALTER TABLE "Agent" DROP COLUMN "testRoles",
ADD COLUMN     "routeAccess" "RouteAccess" NOT NULL DEFAULT 'ADMIN';

-- AlterTable
ALTER TABLE "Log" DROP CONSTRAINT "Log_pkey",
ADD COLUMN     "userId" INTEGER,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Log_pkey" PRIMARY KEY ("id");

-- DropEnum
DROP TYPE "TestRoleNames";
