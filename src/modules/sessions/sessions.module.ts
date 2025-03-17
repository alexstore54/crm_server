import { Module } from '@nestjs/common';
import { CustomersSessionsController } from '@/modules/sessions/controllers/customers-sessions.controller';
import { AuthRedisModule, AuthRedisService } from '@/shared/services/redis/auth-redis';
import { ValidationModule, ValidationService } from '@/shared/services/validation';
import { AgentsSessionsController } from '@/modules/sessions/controllers/agents-sessions.controller';
import { MySessionsController } from '@/modules/sessions/controllers/my-sessions.controller';

@Module({
  imports: [AuthRedisModule, ValidationModule],
  controllers: [AgentsSessionsController, CustomersSessionsController, MySessionsController],
  providers: [AuthRedisService, ValidationService],
})
export class SessionsModule {}
