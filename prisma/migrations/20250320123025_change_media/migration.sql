/*
  Warnings:

  - You are about to drop the column `mediaId` on the `Agent` table. All the data in the column will be lost.
  - You are about to drop the `Media` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Agent" DROP CONSTRAINT "Agent_mediaId_fkey";

-- AlterTable
ALTER TABLE "Agent" DROP COLUMN "mediaId",
ADD COLUMN     "avatarURL" TEXT;

-- DropTable
DROP TABLE "Media";

-- DropEnum
DROP TYPE "MediaType";
