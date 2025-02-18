import { Module } from '@nestjs/common';
import { CustomerService, LeadsService } from '@/modules/users/services';
import { CustomerController } from '@/modules/users/controllers/customer.controller';
import { LeadsController } from '@/modules/users/controllers/leads.controller';
import { CustomerRepository, LeadsRepository } from '@/modules/users/repositories';

@Module({
  controllers: [CustomerController, LeadsController],
  providers: [CustomerService, LeadsService, CustomerRepository, LeadsRepository],
  exports: [CustomerRepository, LeadsRepository],
})
export class UserModule {}
