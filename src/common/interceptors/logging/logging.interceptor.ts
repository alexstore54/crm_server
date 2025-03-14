import {
  CallHandler,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { CreateLog } from '@/modules/logger/dto';
import { LogLevel, LogUserType } from '@prisma/client';
import { AppLoggerService } from '@/modules/logger/services';
import { PrismaService } from '@/shared/db/prisma';
import { AgentAuthPayload, CustomerAuthPayload } from '@/shared/types/auth';
import { ERROR_MESSAGES } from '@/shared/constants/errors';

@Injectable()
export class AppLoggingInterceptor implements NestInterceptor {
  private userIdCache = new Map<string, { userId: number; timer: NodeJS.Timeout }>();
  private readonly CACHE_TTL = 60000 * 5;

  constructor(
    private logger: AppLoggerService,
    private prisma: PrismaService,
  ) {}

  public async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const { method, url, user } = request;

    const now = Date.now();
    let userId: number | null = null;

    if (user) {
      userId = await this.getUserIdFromCacheOrDb(user);
    }

    return next.handle().pipe(
      tap(() => {
        const logEntry: CreateLog = {
          message: `Request to ${method} ${url} took ${Date.now() - now}ms`,
          context: { path: url },
          level: LogLevel.INFO,
          userId: userId ?? undefined,
          logUserType: userId ? this.getLogUserType(user) : undefined,
        };
        this.logger.log(logEntry.message, logEntry);
      }),
    );
  }

  private async getUserIdFromCacheOrDb(
    payload: AgentAuthPayload | CustomerAuthPayload,
  ): Promise<number | null> {
    const cacheKey = `${payload.sub}-${this.getLogUserType(payload)}`;
    if (this.userIdCache.has(cacheKey)) {
      const cached = this.userIdCache.get(cacheKey);
      if (cached) {
        clearTimeout(cached.timer);
        cached.timer = this.setCacheTimer(cacheKey);
        return cached.userId;
      }
    }

    const userId = await this.executeUserIdFromRequest(payload);
    if (userId !== null) {
      this.userIdCache.set(cacheKey, { userId, timer: this.setCacheTimer(cacheKey) });
    }
    return userId;
  }

  private setCacheTimer(cacheKey: string): NodeJS.Timeout {
    return setTimeout(() => {
      this.userIdCache.delete(cacheKey);
    }, this.CACHE_TTL);
  }

  private async executeUserIdFromRequest(
    payload?: AgentAuthPayload | CustomerAuthPayload,
  ): Promise<number | null> {
    if (!payload) {
      return null;
    }
    const logUserType = this.getLogUserType(payload);
    if (logUserType === LogUserType.AGENT) {
      return this.getAgentIdByPublicId(payload.sub);
    }
    return this.getCustomerIdByPublicId(payload.sub);
  }

  private async getCustomerIdByPublicId(publicId: string): Promise<number | null> {
    try {
      const customer = await this.prisma.customer.findFirst({
        where: { publicId },
        select: { id: true },
      });
      return customer?.id || null;
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  private async getAgentIdByPublicId(publicId: string): Promise<number | null> {
    try {
      const agent = await this.prisma.agent.findFirst({
        where: { publicId },
        select: { id: true },
      });
      return agent?.id || null;
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  private getLogUserType(payload: AgentAuthPayload | CustomerAuthPayload): LogUserType {
    if ('desksPublicId' in payload) {
      return LogUserType.AGENT;
    }
    return LogUserType.CUSTOMER;
  }
}