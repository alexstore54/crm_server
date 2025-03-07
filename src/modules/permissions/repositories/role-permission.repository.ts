import { PrismaService } from '@/shared/db/prisma';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Prisma, RolePermission } from '@prisma/client';

import { IncomingPermission } from '@/modules/permissions/dto/agent-permissions';
import { RolePermissionWithDetails } from '@/shared/utils';
import { ERROR_MESSAGES } from '@/shared/constants/errors';

@Injectable()
export class RolePermissionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getRolePermissionsByRoleId(roleId: number): Promise<RolePermissionWithDetails[]> {
    try {
      return await this.prisma.rolePermission.findMany({
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

  async getManyByRoleIdWithTx(
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

  async getOneByRoleIdAndPermsIdsWithTx(
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
