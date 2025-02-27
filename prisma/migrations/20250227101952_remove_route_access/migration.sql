/*
  Warnings:

  - You are about to drop the column `routeAccess` on the `Agent` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Agent" DROP COLUMN "routeAccess";

-- DropEnum
DROP TYPE "RouteAccess";
