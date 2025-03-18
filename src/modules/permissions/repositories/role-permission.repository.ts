import { PrismaService } from '@/shared/db/prisma';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { IncomingPermission } from '@/modules/permissions/dto';
import { ERROR_MESSAGES } from '@/shared/constants/errors';
import { FullPermission, PrismaPermissionWithDetails } from '@/shared/types/permissions';
import { Prisma } from '@prisma/client';

@Injectable()
export class RolePermissionRepository {
  constructor(private readonly prisma: PrismaService) {}

  public async txCreateMany(permissions: FullPermission[], tx: Prisma.TransactionClient){
      return tx.rolePermission.createManyAndReturn({data: permissions})
  }

  public async updateManyByRoleId(
    roleId: number,
    permissions: IncomingPermission[],
  ): Promise<PrismaPermissionWithDetails[]> {
    try {
      return this.prisma.$transaction(async (tx) => {
        await tx.rolePermission.deleteMany({
          where: {
            permissionId: {
              in: permissions.map((permission) => permission.permissionId),
            },
          },
        });

        await tx.rolePermission.createMany({
          data: permissions.map((permission) => ({
            roleId,
            permissionId: permission.permissionId,
            allowed: permission.allowed,
          })),
        });

        return tx.rolePermission.findMany({
          where: { roleId },
          include: { Permission: true },
        });
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
      return await this.prisma.$transaction(async (prisma) => {
        await prisma.rolePermission.deleteMany({
          where: { roleId },
        });

        const rolePermissionData = permissions.map((perm) => ({
          roleId,
          permissionId: perm.permissionId,
          allowed: perm.allowed,
        }));
        await prisma.rolePermission.createMany({
          data: rolePermissionData,
        });

        const agents = await prisma.agent.findMany({
          where: { roleId },
          select: { id: true },
        });

        if (agents.length > 0) {
          const agentIds = agents.map((agent) => agent.id);
          const permissionIds = permissions.map((perm) => perm.permissionId);

          await prisma.agentPermission.deleteMany({
            where: {
              agentId: { in: agentIds },
              permissionId: { in: permissionIds },
            },
          });

          const agentPermissionData = agentIds.flatMap((agentId) =>
            permissions.map((perm) => ({
              agentId,
              permissionId: perm.permissionId,
              allowed: perm.allowed,
            })),
          );

          await prisma.agentPermission.createMany({
            data: agentPermissionData,
          });
        }

        return prisma.rolePermission.findMany({
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
}
