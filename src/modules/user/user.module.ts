import { Module } from '@nestjs/common';
import { CustomerService, LeadsService } from '@/modules/user/services';
import { CustomerController } from '@/modules/user/controllers/customer.controller';
import { LeadsController } from '@/modules/user/controllers/leads.controller';
import { CustomersRepository, LeadRepository } from '@/modules/user/repositories';
import { AgentAccessGuard } from '@/common/guards/tokens/agent';
import { PrismaModule, PrismaService } from '@/shared/db/prisma';

@Module({
  controllers: [CustomerController, LeadsController, PrismaModule],
  providers: [
    CustomerService,
    LeadsService,
    CustomersRepository,
    LeadRepository,
    AgentAccessGuard,
    PrismaService,
  ],
  exports: [CustomersRepository, LeadRepository],
})
export class UserModule {}
