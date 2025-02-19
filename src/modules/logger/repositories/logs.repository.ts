import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '@/shared/db/prisma';
import { Log, LogLevel } from '@prisma/client';
import { CreateLog, UpdateLog } from '@/modules/logger/dto';

@Injectable()
export class LogsRepository {
  constructor(private prisma: PrismaService) {}

  public async getLogs(limit: number, offset: number): Promise<Log[]> {
    try {
      return await this.prisma.log.findMany({
        take: limit,
        skip: offset,
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error: any) {
      throw new InternalServerErrorException(error.message);
    }
  }

  public async createOneLog(data: CreateLog): Promise<Log> {
    const level: LogLevel = (data.level || 'INFO').toUpperCase() as LogLevel;
    try {
      return await this.prisma.log.create({
        data: {
          ...data,
          level,
          context: data.context ? JSON.stringify(data.context) : undefined,
        },
      });
    } catch (error: any) {
      throw new InternalServerErrorException(error.message);
    }
  }

  public async updateOneLog(id: number, data: UpdateLog): Promise<Log> {
    try {
      return await this.prisma.log.update({
        where: { id },
        data: {
          ...data,
          context: data.context ? JSON.stringify(data.context) : undefined,
        },
      });
    } catch (error: any) {
      throw new InternalServerErrorException(error.message);
    }
  }

  public async findLogsByUserId(userId: number): Promise<Log[]> {
    try {
      return await this.prisma.log.findMany({
        where: { userId },
      });
    } catch (error: any) {
      throw new InternalServerErrorException(error.message);
    }
  }

  public async findOneLogById(id: number): Promise<Log | null> {
    try {
      return await this.prisma.log.findUnique({
        where: { id },
      });
    } catch (error: any) {
      throw new InternalServerErrorException(error.message);
    }
  }
}