/*
  Warnings:

  - You are about to drop the `Logs` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Logs";

-- CreateTable
CREATE TABLE "Log" (
    "id" SERIAL NOT NULL,
    "level" "LogLevel" NOT NULL DEFAULT 'INFO',
    "message" TEXT NOT NULL,
    "userId" TEXT DEFAULT 'anonymous',
    "context" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Log_pkey" PRIMARY KEY ("id")
);
