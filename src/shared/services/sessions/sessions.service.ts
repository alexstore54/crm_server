import { BadRequestException, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { CreateSessionInput, Session, SessionId, SessionUUID, UpdateSessionInput } from '@/shared/types/auth';
import { ERROR_MESSAGES } from '@/shared/constants/errors';

@Injectable()
export class SessionsService {
  private redis: Redis;

  constructor(private redisService: RedisService) {
    this.redis = redisService.getOrThrow();
  }

  public async saveUserSession(input: CreateSessionInput): Promise<string> {
    const { userId, sessionUUID } = input;
    const sessionId: SessionId = this.mapSessionKey(userId, sessionUUID);
    await this.redis.set(sessionId, JSON.stringify({ ...input, sessionId: sessionUUID }));
    return sessionId;
  }

  public async getUserSession(userId: string, sessionUUID: SessionUUID): Promise<Session | null> {
    const sessionId: SessionId = this.mapSessionKey(userId, sessionUUID);
    const session = await this.redis.get(sessionId);
    return session ? JSON.parse(session) as Session : null;
  }

  public async getUserSessionBySessionId(sessionId: SessionId): Promise<Session | null> {
    const session = await this.redis.get(sessionId);
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

  public async updateUserSession(userId: string, sessionUUID: SessionUUID, input: UpdateSessionInput): Promise<void> {
    const sessionId = this.mapSessionKey(userId, sessionUUID);
    const session = await this.getUserSession(userId, sessionUUID);
    if (!session) {
      throw new BadRequestException(ERROR_MESSAGES.SESSION_NOT_FOUND);
    }
    const updatedSession = { ...session, ...input };
    await this.redis.set(sessionId, JSON.stringify(updatedSession));
  }

  public async deleteUserSession(userId: string, sessionUUID: SessionUUID): Promise<void> {
    const key = this.mapSessionKey(userId, sessionUUID);
    await this.redis.del(key);
  }

  public async deleteAllUserSessions(userId: string): Promise<void> {
    const keys = await this.redis.keys(`${userId}:*`);
    await this.redis.del(...keys);
  }

  public async deleteAllUserSessionsExceptCurrent(userId: string, sessionUUID: SessionUUID): Promise<void> {
    const keys = await this.redis.keys(`${userId}:*`);
    const keysToDelete = keys.filter(key => !key.endsWith(sessionUUID));
    if (keysToDelete.length > 0) {
      await this.redis.del(...keysToDelete);
    }
  }

  private mapSessionKey(userId: string, sessionUUID: SessionUUID): SessionId {
    return `${userId}:${sessionUUID}`;
  }
}