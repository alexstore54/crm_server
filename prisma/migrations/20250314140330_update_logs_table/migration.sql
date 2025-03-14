-- CreateEnum
CREATE TYPE "LogUserType" AS ENUM ('AGENT', 'CUSTOMER');

-- AlterTable
ALTER TABLE "Log" ADD COLUMN     "userType" "LogUserType";
