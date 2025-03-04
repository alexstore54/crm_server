import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '@/shared/db/prisma';
import { ERROR_MESSAGES } from '@/shared/constants/errors';
import { GeneralEntities } from '@/shared/types/validation';

@Injectable()
export class ValidationService {
  constructor(private readonly prisma: PrismaService) {}

  public async validateAgentOperationPermissions() {}

  public async validateLeadOperationPermissions() {}

  public async getAgentGeneralEntities(currentAgentPublicId: string, agentPublicId: string): Promise<GeneralEntities[]> {
    const entities: GeneralEntities[] = [];

    const teams = await this.prisma.team.findMany({
      where: {
        Agents: {
          some: {
            publicId: currentAgentPublicId,
          },
        },
      },
    });

    const desks = await this.prisma.desk.findMany({
      where: {
        Agent: {
          some: {
            publicId: currentAgentPublicId,
          },
        },
      },
    });

    if (teams.length > 0) {
      entities.push(GeneralEntities.TEAM);
    }

    if (desks.length > 0) {
      entities.push(GeneralEntities.DESK);
    }

    return entities;
  }

  public async isAgentsInOneTeam(publicIds: string[], publicTeamId: string): Promise<boolean> {
    try {
      const agents = await this.prisma.agent.findMany({
        where: {
          publicId: { in: publicIds },
          Team: {
            some: {
              publicId: publicTeamId,
            },
          },
        },
      });
      return agents.length === publicIds.length;
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  public async isAgentsInOneDesk(publicIds: string[], deskPublicId: string): Promise<boolean> {
    try {
      const agents = await this.prisma.agent.findMany({
        where: {
          publicId: { in: publicIds },
          Desk: {
            some: {
              publicId: deskPublicId,
            },
          },
        },
      });
      return agents.length === publicIds.length;
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  private getAgentPermissionsListByOperation() {

  }
}
