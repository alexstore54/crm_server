import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '@/shared/db/prisma';
import { ERROR_MESSAGES } from '@/shared/constants/errors';

@Injectable()
export class ValidationService {
  constructor(private readonly prisma: PrismaService) {}

  public async getGeneralInstuctions(publicIds: string[]): Promise<string[]> {

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
}