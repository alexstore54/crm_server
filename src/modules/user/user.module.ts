import { Module } from '@nestjs/common';
import { CustomerService, LeadsService } from '@/modules/user/services';

import { CustomersRepository, LeadRepository } from '@/modules/user/repositories';
import { AgentAccessGuard } from '@/common/guards/tokens/agent';
import { PrismaService } from '@/shared/db/prisma';
import {
  CustomerController,
  LeadsCallBackController,
  LeadsController,
} from '@/modules/user/controllers';
import { ValidationModule, ValidationService } from '@/shared/services/validation';
import { AuthRedisModule, AuthRedisService } from '@/shared/services/redis/auth-redis';
import { MediaModule } from '@/modules/media';
import { MediaService } from '@/modules/media/services/media.service';

@Module({
  imports: [ValidationModule, AuthRedisModule, MediaModule],
  controllers: [CustomerController, LeadsController, LeadsCallBackController],
  providers: [
    CustomerService,
    LeadsService,
    CustomersRepository,
    LeadRepository,
    AgentAccessGuard,
    PrismaService,
    AuthRedisService,
    ValidationService,
    MediaService,
  ],
  exports: [CustomersRepository, LeadRepository],
})
export class UserModule {}
