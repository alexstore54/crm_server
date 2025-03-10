import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '@/shared/db/prisma';
import {
  AgentPermissionRepository,
  RolePermissionRepository,
} from '@/modules/permissions/repositories';
import { ERROR_MESSAGES } from '@/shared/constants/errors';
import { PermissionDetail, PrismaPermissionWithDetails } from '@/shared/types/permissions';
import { PermissionsUtil } from '@/shared/utils/permissions/permissions.util';
import { Prisma, RolePermission } from '@prisma/client';
import { CreateAgentPermissions } from '@/modules/permissions/dto/agent-permissions';
import { AllowedPermission } from '@/modules/permissions/types';
import { IncomingPermissionsUtil } from '@/shared/utils/permissions/incoming-permissions.util';

@Injectable()
export class PermissionsService {
  constructor(
    private readonly agentPermissionsRepository: AgentPermissionRepository,
    private readonly rolePermissionsRepository: RolePermissionRepository,
    private readonly prisma: PrismaService,
  ) {}

  public async getProcessedAgentPermissions(
    agentId: number,
    roleId: number,
  ): Promise<PermissionDetail[]> {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const rolePermissions = await this.getRolePermissions(roleId, tx);
        const agentPermissions = await this.getAgentPermissions(agentId, tx);

        return this.mergeAndFilterPermissions(rolePermissions, agentPermissions);
      });
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  private async getRolePermissions(
    roleId: number,
    tx: Prisma.TransactionClient,
  ): Promise<PermissionDetail[]> {
    const prismaRolePermissions: PrismaPermissionWithDetails[] =
      await this.rolePermissionsRepository.txGetManyWithDetailsById(roleId, tx);

    return PermissionsUtil.mapPrismaPermissionToPermissionDetail(prismaRolePermissions);
  }

  private async getAgentPermissions(
    agentId: number,
    tx: Prisma.TransactionClient,
  ): Promise<PermissionDetail[]> {
    const prismaAgentPermissions: PrismaPermissionWithDetails[] =
      await this.agentPermissionsRepository.txGetManyWithDetailsByAgentId(agentId, tx);

    return PermissionsUtil.mapPrismaPermissionToPermissionDetail(prismaAgentPermissions);
  }

  private mergeAndFilterPermissions(
    rolePermissions: PermissionDetail[],
    agentPermissions: PermissionDetail[],
  ): PermissionDetail[] {
    if (!agentPermissions.length) {
      return PermissionsUtil.filterPermissionsDetail(rolePermissions);
    }

    const mergedPermissions = PermissionsUtil.mergePermissions(rolePermissions, agentPermissions);
    return PermissionsUtil.filterPermissionsDetail(mergedPermissions);
  }
}
