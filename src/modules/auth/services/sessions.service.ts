import { v4 as uuidv4 } from 'uuid';
import { BadRequestException, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { Session, UpdateSessionInput } from '@/shared/types/auth';
import { ERROR_MESSAGES } from '@/shared/constants/errors';

@Injectable()
export class SessionsService {
  private redis: Redis;

  constructor(private redisService: RedisService) {
    this.redis = redisService.getOrThrow();
  }

  public async saveUserSession(session: Session): Promise<string> {
    const { userId } = session;
    const sessionId = uuidv4();
    const key = this.mapSessionKey(userId, sessionId);
    await this.redis.set(key, JSON.stringify({ ...session, sessionId }));
    return sessionId;
  }

  public async getUserSession(userId: string, sessionId: string): Promise<Session | null> {
    const key = this.mapSessionKey(userId, sessionId);
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

  public async updateUserSession(userId: string, sessionId: string, input: UpdateSessionInput): Promise<void> {
    const key = this.mapSessionKey(userId, sessionId);
    const session = await this.getUserSession(userId, sessionId);
    if (!session) {
      throw new BadRequestException(ERROR_MESSAGES.SESSION_NOT_FOUND);
    }
    const updatedSession = { ...session, ...input };
    await this.redis.set(key, JSON.stringify(updatedSession));
  }

  public async deleteUserSession(userId: string, sessionId: string): Promise<void> {
    const key = this.mapSessionKey(userId, sessionId);
    await this.redis.del(key);
  }

  public async deleteAllUserSessions(userId: string): Promise<void> {
    const keys = await this.redis.keys(`${userId}:*`);
    await this.redis.del(...keys);
  }

  private mapSessionKey(userId: string, sessionId: string) {
    return `${userId}:${sessionId}`;
  }
}