import { PrismaService } from '@/shared/db/prisma';
import { Injectable } from '@nestjs/common';
import { Prisma, RolePermission } from '@prisma/client';

import { IncomingPermission } from '@/modules/permissions/dto/agent-permissions';

@Injectable()
export class RolePermissionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getRolePermissionsByRoleId(roleId: number) {
    return this.prisma.rolePermission.findMany({
      where: {
        roleId,
      },
    });
  }

  async getManyByRoleIdWithTx(
    roleId: number,
    tx: Prisma.TransactionClient,
  ): Promise<RolePermission[]> {
    return tx.rolePermission.findMany({
      where: {
        roleId,
      },
    });
  }

  async getOneByRoleIdAndPermsIdsWithTx(
    roleId: number,
    permissions: IncomingPermission[],
    tx: Prisma.TransactionClient,
  ): Promise<RolePermission[]> {
    return tx.rolePermission.findMany({
      where: {
        roleId,
        permissionId: {
          in: permissions.map((p) => p.permissionId),
        },
      },
    });
  }

  // async createRolePermission(data: any) {
  //     try{
  //         return this.prisma.rolePermission.createMany({
  //             data,
  //         });
  //     }catch(error:any) {
  //         throw new Error(error.message);
  //     }
  //}
}
