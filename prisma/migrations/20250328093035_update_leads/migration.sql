/*
  Warnings:

  - You are about to drop the column `publicId` on the `Customer` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Customer_publicId_key";

-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "publicId";
