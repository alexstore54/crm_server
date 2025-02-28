import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/db/prisma';

@Injectable()
export class ValidationService {
  constructor(private readonly prisma: PrismaService) {}

  public async isAgentsInOneTeam(agentPublicId1: string, agentPublicId2: string, teamId: number) {
    try {

    } catch (error: any) {

    }
  }

  public async isAgentsInOneDesk(checkedAgentPublicId: string, deskId: number) {}
}
