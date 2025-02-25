import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { REDIS_CONFIG } from '@/shared/constants/config';

@Injectable()
export class PermissionsRedisService {
  private redis: Redis;

  constructor(private redisService: RedisService) {
    this.redis = redisService.getOrThrow(REDIS_CONFIG.PERMISSIONS.NAMESPACE);
  }



}
