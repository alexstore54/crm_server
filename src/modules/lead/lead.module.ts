import { Module } from '@nestjs/common';
import { CustomerService, LeadsService } from '@/modules/lead/services';

import { CustomersRepository, LeadRepository } from '@/modules/lead/repositories';
import { AgentAccessGuard } from '@/common/guards/tokens/agent';
import { PrismaService } from '@/shared/db/prisma';
import {
  CustomerController,
  LeadsCallBackController,
  LeadsController,
} from '@/modules/lead/controllers';
import { ValidationModule, ValidationService } from '@/shared/services/validation';
import { AuthRedisModule, AuthRedisService } from '@/shared/services/redis/auth-redis';
import { MediaModule } from '@/modules/media';
import { MediaImagesService } from '@/modules/media/services/media-images.service';

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
    MediaImagesService,
  ],
  exports: [CustomersRepository, LeadRepository],
})
export class LeadModule {}
