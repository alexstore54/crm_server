import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { HealthService } from '@/modules/health/health.service';
import { RedisHealthModule } from '@liaoliaots/nestjs-redis-health';

@Module({
  imports: [TerminusModule, RedisHealthModule],
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule {}