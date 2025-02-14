/*
  Warnings:

  - The values [info,warn,error] on the enum `LogLevel` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "LogLevel_new" AS ENUM ('INFO', 'WARN', 'ERROR');
ALTER TABLE "Log" ALTER COLUMN "level" DROP DEFAULT;
ALTER TABLE "Log" ALTER COLUMN "level" TYPE "LogLevel_new" USING ("level"::text::"LogLevel_new");
ALTER TYPE "LogLevel" RENAME TO "LogLevel_old";
ALTER TYPE "LogLevel_new" RENAME TO "LogLevel";
DROP TYPE "LogLevel_old";
ALTER TABLE "Log" ALTER COLUMN "level" SET DEFAULT 'INFO';
COMMIT;

-- AlterTable
ALTER TABLE "Log" ALTER COLUMN "level" DROP NOT NULL,
ALTER COLUMN "level" SET DEFAULT 'INFO';
