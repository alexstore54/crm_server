import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '@/shared/db/prisma';
import { ERROR_MESSAGES } from '@/shared/constants/errors';
import { Prisma, Team } from '@prisma/client';

@Injectable()
export class TeamRepository {
  constructor(private readonly prisma: PrismaService) {}

  public async findManyByAgentPublicId(agentPublicId: string): Promise<Team[]> {
    try {
      return await this.prisma.team.findMany({
        where: {
          Agents: {
            some: {
              publicId: agentPublicId,
            },
          },
        },
      });
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  public async findOneByPublicId(teamPublicId: string): Promise<Team | null> {
    try {
      return this.prisma.team.findUnique({
        where: {
          publicId: teamPublicId,
        },
      });
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  public async findManyByAgentId(agentId: number): Promise<Team[]> {
    try {
      return await this.prisma.team.findMany({
        where: {
          Agents: {
            some: {
              id: agentId,
            },
          },
        },
      });
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  public async createOne(data: Prisma.TeamCreateInput): Promise<Team> {
    try {
      return await this.prisma.team.create({
        data,
      });
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  public async txFindManyByAgentId(agentId: number, tx: Prisma.TransactionClient): Promise<Team[]> {
    try {
      return await tx.team.findMany({
        where: {
          Agents: {
            some: {
              id: agentId,
            },
          },
        },
      });
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }
}
