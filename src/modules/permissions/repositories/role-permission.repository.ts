import { PrismaService } from '@/shared/db/prisma';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Prisma, RolePermission } from '@prisma/client';

import { IncomingPermission } from '@/modules/permissions/dto/agent-permissions';
import { ERROR_MESSAGES } from '@/shared/constants/errors';
import { PrismaPermissionWithDetails } from '@/shared/types/permissions';

@Injectable()
export class RolePermissionRepository {
  constructor(private readonly prisma: PrismaService) {}

  public async getManyById(roleId: number): Promise<RolePermission[]> {
    try {
      return await this.prisma.rolePermission.findMany({
        where: {
          roleId,
        },
      });
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  public async txGetManyById(
    roleId: number,
    tx: Prisma.TransactionClient,
  ): Promise<RolePermission[]> {
    try {
      return await tx.rolePermission.findMany({
        where: {
          roleId,
        },
      });
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  public async txGetManyWithDetailsById(
    roleId: number,
    tx: Prisma.TransactionClient,
  ): Promise<PrismaPermissionWithDetails[]> {
    try {
      return await tx.rolePermission.findMany({
        where: {
          roleId,
        },
        include: {
          Permission: true,
        },
      });
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  public async getManyByIdWithTx(
    roleId: number,
    tx: Prisma.TransactionClient,
  ): Promise<RolePermission[]> {
    try {
      return await tx.rolePermission.findMany({
        where: {
          roleId,
        },
      });
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  public async txGetOneByIdAndPermsIds(
    roleId: number,
    permissions: IncomingPermission[],
    tx: Prisma.TransactionClient,
  ): Promise<RolePermission[]> {
    try {
      return await tx.rolePermission.findMany({
        where: {
          roleId,
          permissionId: {
            in: permissions.map((p) => p.permissionId),
          },
        },
      });
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }
}
