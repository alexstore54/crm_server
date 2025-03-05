-- AlterTable
ALTER TABLE "Lead" ADD COLUMN     "teamId" INTEGER;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;
