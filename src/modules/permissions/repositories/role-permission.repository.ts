import { PrismaService } from '@/shared/db/prisma';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { IncomingPermission } from '@/modules/permissions/dto';
import { ERROR_MESSAGES } from '@/shared/constants/errors';
import { PrismaPermissionWithDetails } from '@/shared/types/permissions';
import { Prisma, RolePermission } from '@prisma/client';
import { CreatRolePermissions } from '@/modules/permissions/dto/role-permissions';

@Injectable()
export class RolePermissionRepository {
  constructor(private readonly prisma: PrismaService) {}

  public async txCreateMany(
    data: CreatRolePermissions,
    tx: Prisma.TransactionClient,
  ): Promise<PrismaPermissionWithDetails[]> {
    const { permissions, roleId } = data;

    try {
      tx.rolePermission.createMany({
        data: permissions.map((permission) => ({
          roleId,
          permissionId: permission.id,
          allowed: permission.allowed,
        })),
      });

      return tx.rolePermission.findMany({ where: { roleId }, include: { Permission: true } });
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  public async txFindManyByRoleId(
    roleId: number,
    tx: Prisma.TransactionClient,
  ): Promise<RolePermission[]> {
    try {
      return tx.rolePermission.findMany({ where: { roleId } });
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  public async txFindFullManyByRoleId(
    roleId: number,
    tx: Prisma.TransactionClient,
  ): Promise<PrismaPermissionWithDetails[]> {
    try {
      return tx.rolePermission.findMany({ where: { roleId }, include: { Permission: true } });
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  public async txUpdateManyByRoleId(
    roleId: number,
    permissions: IncomingPermission[],
    tx: Prisma.TransactionClient,
  ): Promise<PrismaPermissionWithDetails[]> {
    try {
      await tx.rolePermission.deleteMany({
        where: {
          permissionId: {
            in: permissions.map((permission) => permission.id),
          },
        },
      });

      await tx.rolePermission.createMany({
        data: permissions.map((permission) => ({
          roleId,
          permissionId: permission.id,
          allowed: permission.allowed,
        })),
      });

      return tx.rolePermission.findMany({
        where: { roleId },
        include: { Permission: true },
      });
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  async deepUpdateByRoleId(
    roleId: number,
    permissions: IncomingPermission[],
  ): Promise<PrismaPermissionWithDetails[]> {
    try {
      return await this.prisma.$transaction(async (tx) => {
        await tx.rolePermission.deleteMany({
          where: { roleId },
        });

        const rolePermissionData = permissions.map((perm) => ({
          roleId,
          permissionId: perm.id,
          allowed: perm.allowed,
        }));
        await tx.rolePermission.createMany({
          data: rolePermissionData,
        });

        const agents = await tx.agent.findMany({
          where: { roleId },
          select: { id: true },
        });

        if (agents.length > 0) {
          const agentIds = agents.map((agent) => agent.id);
          const permissionIds = permissions.map((perm) => perm.id);

          await tx.agentPermission.deleteMany({
            where: {
              agentId: { in: agentIds },
              permissionId: { in: permissionIds },
            },
          });

          const agentPermissionData = agentIds.flatMap((agentId) =>
            permissions.map((perm) => ({
              agentId,
              permissionId: perm.id,
              allowed: perm.allowed,
            })),
          );

          await tx.agentPermission.createMany({
            data: agentPermissionData,
          });
        }

        return tx.rolePermission.findMany({
          where: { roleId },
          include: { Permission: true },
        });
      });
    } catch (error: any) {
      throw new InternalServerErrorException(
        `Database error during permission update: ${error.message}`,
      );
    }
  }

  public async txDeleteManyByRoleId(roleId: number, tx: Prisma.TransactionClient) {
    return tx.rolePermission.deleteMany({ where: { roleId } });
  }
}
