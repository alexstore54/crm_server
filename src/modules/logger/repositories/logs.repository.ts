import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/db';
import { Log } from '@prisma/client';
import { CreateLog, UpdateLog } from '@/modules/logger/dto';

@Injectable()
export class LogsRepository {
  constructor(private prisma: PrismaService) {
  }

  public async getLogs(limit: number, offset: number): Promise<Log[]> {
    return this.prisma.log.findMany({
      take: limit,
      skip: offset,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  public async createLog(data: CreateLog): Promise<Log> {
    return this.prisma.log.create({
      data: {
        ...data,
        context: data.context ? JSON.stringify(data.context) : undefined,
      },
    });
  }

  public async updateLog(id: number, data: UpdateLog): Promise<Log> {
    return this.prisma.log.update({
      where: { id },
      data: {
        ...data,
        context: data.context ? JSON.stringify(data.context) : undefined,
      },
    });
  }

  public async getLogsByUserId(userId: string): Promise<Log[]> {
    return this.prisma.log.findMany({
      where: { userId },
    });
  }

  public async getLogById(id: number): Promise<Log | null> {
    return this.prisma.log.findUnique({
      where: { id },
    });
  }
}