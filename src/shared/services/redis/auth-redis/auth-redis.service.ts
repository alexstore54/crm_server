import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import {
  PayloadId,
  PayloadUUID,
  PermissionsTable,
  SaveAgentInput,
  SaveCustomerInput,
  Session,
  UpdatePermissionsInput,
  UpdateSessionInput,
} from '@/shared/types/redis';
import Redis from 'ioredis';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { ConfigService } from '@nestjs/config';
import { REDIS_CONFIG } from '@/shared/constants/config';
import { configKeys } from '@/shared/schemas';
import { AppLoggerService } from '@/modules/logger/services';
import { LogLevel } from '@prisma/client';
import { ERROR_MESSAGES } from '@/shared/constants/errors';

@Injectable()
export class AuthRedisService {
  private readonly permissionsRedis: Redis;
  private readonly sessionsRedis: Redis;
  private readonly ttl: number;

  constructor(
    private redisService: RedisService,
    private logger: AppLoggerService,
    configService: ConfigService,
  ) {
    this.permissionsRedis = redisService.getOrThrow(REDIS_CONFIG.PERMISSIONS.NAMESPACE);
    this.sessionsRedis = redisService.getOrThrow(REDIS_CONFIG.SESSIONS.NAMESPACE);
    this.ttl = configService.get<number>(configKeys.REFRESH_TOKEN_EXPIRES_IN) as number;
  }

  public async saveCustomer(input: SaveCustomerInput) {
    const { customerPublicId, payloadUUID, sessionInput } = input;
    const redisId: PayloadId = this.mapRedisId(customerPublicId, payloadUUID);
    const stringifyInput = JSON.stringify(sessionInput);
    try {
      await this.sessionsRedis.set(redisId, stringifyInput);
    } catch (error: any) {
      this.handleError(error);
    }
  }

  public async saveAgent(input: SaveAgentInput) {
    const { agentPublicId, payloadUUID, sessionInput, permissionsInput } = input;
    const redisId: PayloadId = this.mapRedisId(agentPublicId, payloadUUID);
    try {
      const stringifySessionInput = JSON.stringify(sessionInput);
      const stringifyPermissionsInput = JSON.stringify(permissionsInput);

      await this.sessionsRedis.set(redisId, stringifySessionInput);
      await this.permissionsRedis.set(redisId, stringifyPermissionsInput);
    } catch (error: any) {
      this.handleError(error);
    }
  } 

  public async updateSession(
    userPublicId: string,
    payloadUUId: PayloadUUID,
    input: UpdateSessionInput,
  ): Promise<void> {
    const redisId: PayloadId = this.mapRedisId(userPublicId, payloadUUId);
    const session = await this.getOneSessionByRedisId(redisId);
    if (!session) {
      throw new NotFoundException(ERROR_MESSAGES.SESSION_NOT_FOUND);
    }
    const updatedSession = { ...session, ...input };
    try {
      await this.sessionsRedis.set(redisId, JSON.stringify(updatedSession));
    } catch (error: any) {
      this.handleError(error);
    }
  }

  public async updatePermissions(
    userPublicId: string,
    payloadUUID: PayloadUUID,
    input: UpdatePermissionsInput,
  ) {
    const redisId = this.mapRedisId(userPublicId, payloadUUID);

    const permissions = await this.getOnePermissionByRedisId(redisId);
    if (!permissions) {
      throw new NotFoundException(ERROR_MESSAGES.PERMISSIONS_NOT_PROVIDED);
    }
    try {
      const stringifyInput = JSON.stringify({ ...permissions, ...input });
      await this.permissionsRedis.set(redisId, stringifyInput);
    } catch (error: any) {
      this.handleError(error);
    }
  }

  public async refreshPermissions(userPublicId: string, payloadUUID: PayloadUUID): Promise<void> {
    const redisId: PayloadId = this.mapRedisId(userPublicId, payloadUUID);
    try {
      await this.permissionsRedis.expire(redisId, this.ttl);
    } catch (error) {
      this.handleError(error);
    }
  }

  public async getOnePermissions(
    userPublicId: string,
    payloadUUID: PayloadUUID,
  ): Promise<PermissionsTable | null> {
    const redisId = this.mapRedisId(userPublicId, payloadUUID);

    try {
      const stringifyResult = await this.permissionsRedis.get(redisId);
      if (!stringifyResult) {
        return null;
      }
      
      const parsedResult = JSON.parse(stringifyResult) as { permissions: PermissionsTable };
      return parsedResult.permissions;
    } catch (error: any) {
      this.handleError(error);
      return null;
    }
  }

  public async getOnePermissionByRedisId(redisId: PayloadId): Promise<PermissionsTable | null> {
    try {
      const stringifyResult = await this.permissionsRedis.get(redisId);
      if (!stringifyResult) {
        return null;
      }
      return JSON.parse(stringifyResult) as PermissionsTable;
    } catch (error: any) {
      this.handleError(error);
      return null;
    }
  }

  public async getOneSession(
    userPublicId: string,
    payloadUUID: PayloadUUID,
  ): Promise<Session | null> {
    try {
      const redisId = this.mapRedisId(userPublicId, payloadUUID);
      const stringifyResult = await this.sessionsRedis.get(redisId);
      if (!stringifyResult) {
        return null;
      }
      return JSON.parse(stringifyResult) as Session;
    } catch (error: any) {
      this.handleError(error);
      return null;
    }
  }

  public async getOneSessionByRedisId(redisId: PayloadId): Promise<Session | null> {
    try {
      const stringifyResult = await this.sessionsRedis.get(redisId);
      if (!stringifyResult) {
        return null;
      }
      return JSON.parse(stringifyResult) as Session;
    } catch (error) {
      this.handleError(error);
      return null;
    }
  }

  public async getAllSessionsByUserId(userId: string): Promise<Session[]> {
    try {
      const keys = await this.sessionsRedis.keys(`${userId}:*`);
      const sessions = await this.sessionsRedis.mget(keys);
      if (!sessions || !sessions.length) {
        return [];
      }
      return sessions
        .filter((session) => session !== null)
        .map((session) => JSON.parse(session) as Session);
    } catch (error: any) {
      this.handleError(error);
      return [];
    }
  }

  public async deleteOneSession(userPublicId: string, payloadUUID: PayloadUUID) {
    try {
      const redisId = this.mapRedisId(userPublicId, payloadUUID);
      await this.sessionsRedis.del(redisId);
      await this.checkAndDeletePermissionsWithSessions(userPublicId, payloadUUID);
    } catch (error: any) {
      this.handleError(error);
    }
  }

  public async deleteAllSessionsByUserPublicId(userPublicId: string) {
    try {
      const keys = await this.sessionsRedis.keys(`${userPublicId}:*`);
      if (keys.length > 0) {
        await this.sessionsRedis.del(...keys);
      }
      await this.checkAndDeletePermissions(userPublicId, keys[0]);
    } catch (error: any) {
      this.handleError(error);
    }
  }

  public async deletePermissionsByRedisId(redisId: PayloadId) {
    try {
      await this.permissionsRedis.del(redisId);
    } catch (error: any) {
      this.handleError(error);
    }
  }

  public async deletePermissions(userPublicId: string, payloadUUID: PayloadUUID) {
    try {
      const redisId = this.mapRedisId(userPublicId, payloadUUID);
      await this.permissionsRedis.del(redisId);
    } catch (error: any) {
      this.handleError(error);
    }
  }

  public async deleteAllUserSessionsExceptCurrent(userPublicId: string, payloadUUID: PayloadUUID) {
    try {
      const keys = await this.sessionsRedis.keys(`${userPublicId}:*`);
      const keysToDelete = keys.filter((key) => !key.endsWith(payloadUUID));
      if (keysToDelete.length > 0) {
        await this.sessionsRedis.del(...keysToDelete);
      }
    } catch (error: any) {
      this.handleError(error);
    }
  }

  private mapRedisId(userPublicId: string, payloadUUID: PayloadUUID): PayloadId {
    return `${userPublicId}:${payloadUUID}`;
  }

  private handleError(error: any): void {
    const message = error.message;
    this.logger.error(message, {
      message,
      level: LogLevel.ERROR,
    });
    throw new InternalServerErrorException(ERROR_MESSAGES.REDIS_ERROR);
  }

  private async checkAndDeletePermissionsWithSessions(
    userPublicId: string,
    payloadUUID: PayloadUUID,
  ) {
    try {
      const redisId = this.mapRedisId(userPublicId, payloadUUID);
      const permissions = await this.getOnePermissionByRedisId(redisId);
      const sessions = await this.getAllSessionsByUserId(userPublicId);
      if (!permissions && sessions.length === 0) {
        await this.deletePermissionsByRedisId(redisId);
      }
    } catch (error: any) {
      this.handleError(error);
    }
  }

  private async checkAndDeletePermissions(userPublicId: string, payloadUUID: PayloadUUID) {
    try {
      const permissions = await this.getOnePermissions(userPublicId, payloadUUID);
      if (permissions) {
        await this.deletePermissions(userPublicId, payloadUUID);
      }
    } catch (error: any) {
      this.handleError(error);
    }
  }
}
