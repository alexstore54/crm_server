import { Injectable, NotFoundException } from '@nestjs/common';
import { LogsRepository } from '@/modules/logger/repositories';
import { Log } from '@prisma/client';
import { AgentRepository } from '@/modules/agent/repositories';

@Injectable()
export class LogsService {
  constructor(
    private logRepository: LogsRepository,
    private readonly agentRepository: AgentRepository,
  ) {}

  public async getLogsByUserPublicId(agentPublicId: string): Promise<Log[]> {
    const agent = await this.agentRepository.findOneByPublicId(agentPublicId);
    if (!agent) {
      throw new NotFoundException();
    }
    return this.logRepository.findLogsByUserId(agent.id);
  }

  public async getLogs(page: number, limit: number): Promise<Log[]> {
    const offset = (page - 1) * limit;
    return this.logRepository.getLogs(limit, offset);
  }

  public async getLogById(id: number): Promise<Log | null> {
    return this.logRepository.findOneLogById(id);
  }
}
