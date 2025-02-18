-- DropForeignKey
ALTER TABLE "Leads" DROP CONSTRAINT "Leads_status_id_fkey";

-- DropIndex
DROP INDEX "Leads_status_id_key";

-- AlterTable
ALTER TABLE "Leads" ALTER COLUMN "status_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Leads" ADD CONSTRAINT "Leads_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "LeadStatus"("id") ON DELETE SET NULL ON UPDATE CASCADE;
