import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/shared/db/prisma';
import { ERROR_MESSAGES } from '@/shared/constants/errors';
import { Prisma, Team } from '@prisma/client';
import { CreateTeam, UpdateTeam } from '@/modules/team/dto';
import { FullTeam } from '@/shared/types/team';

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

  public async txFindManyByIds(ids: number[], tx: Prisma.TransactionClient): Promise<Team[]> {
    try {
      return await this.prisma.team.findMany({
        where: {
          id: {
            in: ids,
          },
        },
      });
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  public async findOneFullByPublicId(teamPublicId: string): Promise<FullTeam> {
    try {
      return this.prisma.$transaction(async (tx) => {
        const team = await tx.team.findUnique({
          where: { publicId: teamPublicId },
        });
        if (!team) {
          throw new NotFoundException();
        }
        const desk = await tx.desk.findUnique({
          where: { id: team?.deskId },
        });
        return {
          team,
          desk,
        };
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

  public async findMany(page: number, limit: number): Promise<Team[]> {
    try {
      return this.prisma.team.findMany({
        skip: (page - 1) * limit,
        take: limit,
      });
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  public async updateOneByPublicId(
    teamPublicId: string,
    data: UpdateTeam,
    avatarURL: string | null,
  ): Promise<Team> {
    try {
      return this.prisma.team.update({
        where: {
          publicId: teamPublicId,
        },
        data: {
          ...data,
          avatarURL,
        },
      });
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  public async deleteOneByPublicId(teamPublicId: string): Promise<Team> {
    try {
      return this.prisma.$transaction(async (tx) => {
        const team = await tx.team.findUnique({
          where: {
            publicId: teamPublicId,
          },
        });
        if (!team) {
          throw new NotFoundException();
        }

        await tx.team.update({
          where: {
            publicId: teamPublicId,
          },
          data: {
            Agents: {
              set: [],
            },
          },
        });

        return tx.team.delete({
          where: {
            publicId: teamPublicId,
          },
        });

        //#TODO - implement add default team to all agents
      });
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  public async createOne(data: CreateTeam): Promise<Team> {
    try {
      return this.prisma.$transaction(async (tx) => {
        const desk = await tx.desk.findUnique({
          where: {
            id: data.deskId,
          },
        });

        if (!desk) {
          throw new NotFoundException();
        }

        return this.prisma.team.create({
          data,
        });
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
