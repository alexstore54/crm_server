-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'DOCUMENT');

-- AlterTable
ALTER TABLE "Agent" ADD COLUMN     "mediaId" INTEGER;

-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "avatarURL" TEXT;

-- AlterTable
ALTER TABLE "Role" ADD COLUMN     "avatarURL" TEXT;

-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "avatarURL" TEXT;

-- CreateTable
CREATE TABLE "Media" (
    "id" SERIAL NOT NULL,
    "src" TEXT NOT NULL,
    "type" "MediaType" NOT NULL,
    "ext" TEXT NOT NULL,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Media_id_key" ON "Media"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Media_src_key" ON "Media"("src");

-- AddForeignKey
ALTER TABLE "Agent" ADD CONSTRAINT "Agent_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;
