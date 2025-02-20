import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { HealthService } from '@/modules/health/health.service';
import { RedisHealthIndicator } from '@liaoliaots/nestjs-redis-health';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { configKeys } from '@/shared/schemas';

@Controller('health')
export class HealthController {
  private readonly redis: Redis;

  constructor(
    private health: HealthCheckService,
    private healthService: HealthService,
    private redisIndicator: RedisHealthIndicator,
    private configService: ConfigService,
  ) {
    this.redis = new Redis({
      host: configService.get(configKeys.REDIS_HOST) as string,
      port: configService.get(configKeys.REDIS_PORT) as number,
    });
  }

  @Get()
  @HealthCheck()
  async check() {
    return this.health.check([
      () => this.healthService.dbHealthCheck(),
      () =>
        this.redisIndicator.checkHealth('redis', {
          type: 'redis',
          client: this.redis,
          timeout: 500,
        }),
    ]);
  }
}
