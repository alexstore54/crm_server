import { Module } from '@nestjs/common';
import { CustomerService, LeadsService } from '@/modules/users/services';
import { CustomerController } from '@/modules/users/controllers/customer.controller';
import { LeadsController } from '@/modules/users/controllers/leads.controller';
import { CustomersRepository, LeadRepository } from '@/modules/users/repositories';

@Module({
  controllers: [CustomerController, LeadsController],
  providers: [CustomerService, LeadsService, CustomersRepository, LeadRepository],
  exports: [CustomersRepository, LeadRepository],
})
export class UserModule {}
