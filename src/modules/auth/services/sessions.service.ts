import { BadRequestException, Injectable } from '@nestjs/common';
import { RedisService } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import { Session, UpdateSessionInput } from '@/shared/types/auth';
import { ERROR_MESSAGES } from '@/shared/constants/errors';

@Injectable()
export class SessionsService {
  private redis: Redis;

  constructor(private redisService: RedisService) {
    this.redis = redisService.getOrThrow();
  }

  public async getUserSession(userId: string, fingerprint: string): Promise<Session | null> {
    const key = this.mapSessionKey(userId, fingerprint);
    const session = await this.redis.get(key);
    return session ? JSON.parse(session) as Session : null;
  }

  public async getAllUserSessions(userId: string): Promise<Session[]> {
    const keys = await this.redis.keys(`${userId}:*`);
    const sessions = await this.redis.mget(keys);
    if (!sessions || !sessions.length) {
      return [];
    }
    return sessions.filter(session => session !== null)
      .map(session => JSON.parse(session) as Session);
  }

  public async setUserSession(session: Session): Promise<void> {
    const { userId, fingerprint } = session;
    const key = this.mapSessionKey(userId, fingerprint);
    await this.redis.set(key, JSON.stringify(session));
  }

  public async updateUserSession(userId: string, fingerprint: string, input: UpdateSessionInput): Promise<void> {
    const key = this.mapSessionKey(userId, fingerprint);
    const session = await this.getUserSession(userId, fingerprint);
    if (!session) {
      throw new BadRequestException(ERROR_MESSAGES.SESSION_NOT_FOUND);
    }
    const updatedSession = { ...session, ...input };
    await this.redis.set(key, JSON.stringify(updatedSession));
  }

  public async deleteUserSession(userId: string, fingerprint: string): Promise<void> {
    const key = this.mapSessionKey(userId, fingerprint);
    await this.redis.del(key);
  }

  public async deleteAllUserSessions(userId: string): Promise<void> {
    const keys = await this.redis.keys(`${userId}:*`);
    await this.redis.del(...keys);
  }

  private mapSessionKey(userId: string, fingerprint: string) {
    return `${userId}:${fingerprint}`;
  }
}