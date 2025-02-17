import { Injectable } from '@nestjs/common';
import { LogsRepository } from '@/modules/logger/repositories';
import { Log } from '@prisma/client';

@Injectable()
export class LogsService {
  constructor(private logRepository: LogsRepository) {}

  public async getLogsByUserId(id: string): Promise<Log[]> {
    return this.logRepository.getLogsByUserId(id);
  }

  public async getLogs(page: number, limit: number): Promise<Log[]> {
    const offset = (page - 1) * limit;
    return this.logRepository.getLogs(limit, offset);
  }

  public async getLogById(id: number): Promise<Log | null> {
    return this.logRepository.getLogById(id);
  }
}