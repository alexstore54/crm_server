/*
  Warnings:

  - You are about to drop the column `canCRUD` on the `Role` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Role" DROP COLUMN "canCRUD",
ADD COLUMN     "isMutable" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "isVisible" SET DEFAULT true;
