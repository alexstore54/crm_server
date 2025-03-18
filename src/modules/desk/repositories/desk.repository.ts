import { ERROR_MESSAGES } from '@/shared/constants/errors';
import { PrismaService } from '@/shared/db/prisma';
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Desk, Prisma, Team } from '@prisma/client';
import { CreateDesk, UpdateDesk } from '@/modules/desk/dto/desks';

@Injectable()
export class DeskRepository {
  constructor(private readonly prisma: PrismaService) {}

  public async txFindManyByIds(deskIds: number[], tx: Prisma.TransactionClient): Promise<Desk[]> {
    try {
      return tx.desk.findMany({
        where: {
          id: {
            in: deskIds,
          },
        },
      });
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  public async findManyByAgentId(agentId: number): Promise<Desk[]> {
    try {
      return this.prisma.desk.findMany({
        where: {
          Agent: {
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

  public async txFindManyByAgentId(agentId: number, tx: Prisma.TransactionClient): Promise<Desk[]> {
    try {
      return tx.desk.findMany({
        where: {
          Agent: {
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

  async findManyByAgentPublicId(agentPublicId: string): Promise<Desk[]> {
    try {
      return this.prisma.desk.findMany({
        where: {
          Agent: {
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

  public async findManyWithTx(tx: Prisma.TransactionClient): Promise<Desk[]> {
    try {
      return tx.desk.findMany();
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  public async findManyByIds(deskIds: number[]) {
    try {
      return this.prisma.desk.findMany({
        where: {
          id: {
            in: deskIds,
          },
        },
      });
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  public async findTeamsByDeskId(publicId: string): Promise<Team[]> {
    try {
      return this.prisma.$transaction(async (tx) => {
        const desk = await tx.desk.findUnique({ where: { publicId } });

        if (!desk) {
          throw new NotFoundException();
        }
        return tx.team.findMany({
          where: {
            deskId: desk.id,
          },
        });
      });
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  public async createOne(data: CreateDesk): Promise<Desk> {
    try {
      return this.prisma.desk.create({
        data,
      });
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  public async updateOne(publicId: string, data: UpdateDesk): Promise<Desk> {
    try {
      return this.prisma.desk.update({
        where: {
          publicId: publicId,
        },
        data,
      });
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  public async findOneByPublicId(publicId: string): Promise<Desk | null> {
    try {
      return this.prisma.desk.findUnique({
        where: {
          publicId,
        },
      });
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  public async deleteOneByPublicId(publicId: string): Promise<Desk> {
    try {
      return this.prisma.$transaction(async (tx) => {
        const desk = await tx.desk.findUnique({
          where: {
            publicId,
          },
          select: { id: true },
        });

        if (!desk) {
          throw new NotFoundException();
        }

        const deskId: number = desk.id;

        if (!deskId) {
          throw new NotFoundException();
        }

        await tx.deskAdmin.deleteMany({
          where: {
            deskId,
          },
        });

        const teams = await tx.team.findMany({
          where: {
            deskId,
          },
        });

        if (teams.length > 0) {
          for (const team of teams) {
            await tx.team.update({
              where: {
                id: team.id,
              },
              data: {
                Agents: {
                  set: [],
                },
              },
            });
          }
        }

        await tx.team.deleteMany({
          where: {
            deskId,
          },
        });

        return tx.desk.delete({
          where: {
            publicId: publicId,
          },
        });
      });
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  public async findMany(page: number, limit: number): Promise<Desk[]> {
    try {
      return this.prisma.desk.findMany({
        take: limit,
        skip: (page - 1) * limit,
      });
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }
}
