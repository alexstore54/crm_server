import { ERROR_MESSAGES } from '@/shared/constants/errors';
import { PrismaService } from '@/shared/db/prisma';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Desk, Prisma } from '@prisma/client';
import { CreateDesk } from '@/modules/desk/dto';

@Injectable()
export class DeskRepository {
  constructor(private readonly prisma: PrismaService) {}

  public async txFindManyByIds(deskIds: number[], tx: Prisma.TransactionClient): Promise<Desk[]> {
    try {
      return tx.desk.findMany({
        where: {
          id: {
            in: deskIds, // deskIds: number[]
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
            in: deskIds, // deskIds: number[]
          },
        },
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
}
