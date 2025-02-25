import { ERROR_MESSAGES } from '@/shared/constants/errors';
import { PrismaService } from '@/shared/db/prisma';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Desk, Prisma } from '@prisma/client';

@Injectable()
export class DeskRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findManyByIdsWithTx(deskIds: number[], tx: Prisma.TransactionClient): Promise<Desk[]> {
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

  async findManyWithTx(tx: Prisma.TransactionClient): Promise<Desk[]> {
    try {
      return tx.desk.findMany();
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  async findManyByIds(deskIds: number[]) {
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
}
