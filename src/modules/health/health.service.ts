import { Injectable } from '@nestjs/common';
import { HealthIndicatorResult } from '@nestjs/terminus';
import { PrismaService } from '@/shared/db/prisma';

@Injectable()
export class HealthService {
  constructor(private prisma: PrismaService) {}

  public async dbHealthCheck(): Promise<HealthIndicatorResult> {
    try {
      await this.prisma.$queryRaw`SELECT 1;`;

      return {
        database: {
          status: 'up',
          message: 'Database is healthy',
        },
      };
    } catch (error: any) {
      return {
        database: {
          status: 'down',
          message: 'Database is not reachable',
          error: error.message || 'Unknown error',
        },
      };
    }
  }
}
