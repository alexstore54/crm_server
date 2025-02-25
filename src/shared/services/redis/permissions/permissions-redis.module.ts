import { Module } from '@nestjs/common';
import { PermissionsRedisService } from '@/shared/services/redis';

@Module({
  providers: [PermissionsRedisService],
  exports: [PermissionsRedisService],
})
export class PermissionsRedisModule {}
