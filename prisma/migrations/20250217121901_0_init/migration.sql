-- CreateEnum
CREATE TYPE "LogLevel" AS ENUM ('INFO', 'WARN', 'ERROR');

-- CreateTable
CREATE TABLE "Log" (
    "id" TEXT NOT NULL,
    "level" "LogLevel" NOT NULL DEFAULT 'INFO',
    "message" TEXT NOT NULL,
    "context" JSONB,
    "created_at" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Leads" (
    "id" SERIAL NOT NULL,
    "status_id" INTEGER NOT NULL,
    "first_name" TEXT NOT NULL,
    "second_name" TEXT NOT NULL,
    "country" TEXT,
    "created_at" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "public_id" UUID NOT NULL,
    "id" SERIAL NOT NULL,
    "lead_id" INTEGER NOT NULL,
    "password" TEXT NOT NULL,
    "last_time_online" TIMESTAMPTZ(0) NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Email" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "isMain" BOOLEAN NOT NULL DEFAULT false,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Email_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Phone" (
    "id" SERIAL NOT NULL,
    "phone" TEXT NOT NULL,
    "isMain" BOOLEAN NOT NULL DEFAULT false,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Phone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Agent" (
    "public_id" UUID NOT NULL,
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "role_id" INTEGER,
    "password" TEXT NOT NULL,
    "last_time_online" TIMESTAMPTZ(0) NOT NULL,

    CONSTRAINT "Agent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,
    "name" TEXT,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Desk" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Desk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadStatus" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "LeadStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AgentDesks" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_AgentDesks_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Leads_status_id_key" ON "Leads"("status_id");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_public_id_key" ON "Customer"("public_id");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_lead_id_key" ON "Customer"("lead_id");

-- CreateIndex
CREATE UNIQUE INDEX "Agent_public_id_key" ON "Agent"("public_id");

-- CreateIndex
CREATE UNIQUE INDEX "Agent_user_id_key" ON "Agent"("user_id");

-- CreateIndex
CREATE INDEX "_AgentDesks_B_index" ON "_AgentDesks"("B");

-- AddForeignKey
ALTER TABLE "Leads" ADD CONSTRAINT "Leads_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "LeadStatus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "Leads"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Email" ADD CONSTRAINT "Email_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Phone" ADD CONSTRAINT "Phone_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Leads"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agent" ADD CONSTRAINT "Agent_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Role"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AgentDesks" ADD CONSTRAINT "_AgentDesks_A_fkey" FOREIGN KEY ("A") REFERENCES "Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AgentDesks" ADD CONSTRAINT "_AgentDesks_B_fkey" FOREIGN KEY ("B") REFERENCES "Desk"("id") ON DELETE CASCADE ON UPDATE CASCADE;
