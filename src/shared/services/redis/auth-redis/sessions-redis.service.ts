// import { Injectable, NotFoundException } from '@nestjs/common';
// import Redis from 'ioredis';
// import { RedisService } from '@liaoliaots/nestjs-redis';
//
// import { ERROR_MESSAGES } from '@/shared/constants/errors';
// import { REDIS_CONFIG } from '@/shared/constants/config';
// import {
//   CreateSessionInput,
//   PayloadUUID,
//   RedisId,
//   Session,
//   UpdateSessionInput,
// } from '@/shared/types/redis';
//
// @Injectable()
// export class SessionsRedisService {
//   private redis: Redis;
//
//   constructor(private redisService: RedisService) {
//     this.redis = redisService.getOrThrow(REDIS_CONFIG.SESSIONS.NAMESPACE);
//   }
//
//   public async saveUserSession(payloadId: RedisId, input: CreateSessionInput): Promise<string> {
//     return this.redis.set(payloadId, JSON.stringify({ ...input }));
//   }
//
//   public async getOneBypayloadId(payloadId: RedisId): Promise<Session | null> {
//     const session = await this.redis.get(payloadId);
//     return session ? (JSON.parse(session) as Session) : null;
//   }
//
//   public async getAllByUserId(userId: string): Promise<Session[]> {
//     const keys = await this.redis.keys(`${userId}:*`);
//     const sessions = await this.redis.mget(keys);
//     if (!sessions || !sessions.length) {
//       return [];
//     }
//     return sessions
//       .filter((session) => session !== null)
//       .map((session) => JSON.parse(session) as Session);
//   }
//
//   public async updateOne(payloadId: RedisId, input: UpdateSessionInput): Promise<void> {
//     const session = await this.getOneBypayloadId(payloadId);
//     if (!session) {
//       throw new NotFoundException(ERROR_MESSAGES.SESSION_NOT_FOUND);
//     }
//     const updatedSession = { ...session, ...input };
//     await this.redis.set(payloadId, JSON.stringify(updatedSession));
//   }
//
//   public async deleteOne(payloadId: RedisId): Promise<void> {
//     await this.redis.del(payloadId);
//   }
//
//   public async deleteAllByUserId(userId: string): Promise<void> {
//     const keys = await this.redis.keys(`${userId}:*`);
//     await this.redis.del(...keys);
//   }
//
//   public async deleteAllExceptCurrent(userId: string, payloadUUID: PayloadUUID): Promise<void> {
//   a
//   }
// }
