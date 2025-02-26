import { Module } from '@nestjs/common';
import { AuthRedisService } from '@/shared/services/redis/auth-redis';

@Module({
  providers: [AuthRedisService],
  exports: [AuthRedisService],
})
export class AuthRedisModule {}
