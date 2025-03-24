import { PrismaService } from '@/shared/db/prisma';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Permission, Prisma } from '@prisma/client';
import { ERROR_MESSAGES } from '@/shared/constants/errors';

@Injectable()
export class PermissionRepository {
  constructor(private readonly prisma: PrismaService) {}

  public async findManyByIds(ids: number[]): Promise<Permission[]> {
    try {
      return this.prisma.permission.findMany({
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

  public async findOneByKey() {}

  public async findAll() {}

  public async txFindManyByIds(ids: number[], tx: Prisma.TransactionClient): Promise<Permission[]> {
    try {
      return tx.permission.findMany({
        where: { id: { in: ids } },
      });

    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }

  }

  public async txFindManyByIdsExclude(ids: number[], tx: Prisma.TransactionClient) {
    return tx.permission.findMany({
      where: { id: { notIn: ids } },
    });
  }

  public async txFindAll(tx: Prisma.TransactionClient) {
    return tx.permission.findMany({});
  }
}