import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { UpdateAgentPermissions } from '@/modules/agent/dto/update-agent-perms.dto';
import { ERROR_MESSAGES } from '@/shared/constants/errors';
import { PrismaService } from '@/shared/db/prisma';
import {
  AgentPermissionRepository,
  AgentRepository,
  RolePermissionRepository,
} from '@/modules/agent/repositories';
import { Agent, AgentPermission, Prisma, RolePermission } from '@prisma/client';
import {
  CreateAgentPermissions,
  IncomingPermission,
} from '@/modules/permissions/dto/agent-permissions';
import { PermissionsUtil } from '@/shared/utils/permissions/permissions.util';
import { IncomingPermissionsUtil } from '@/shared/utils/permissions/incoming-permissions.util';
import { AllowedPermission } from '@/modules/permissions/types';

@Injectable()
export class AgentPermissionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly agentRepository: AgentRepository,
    private readonly rolePermissionsRepository: RolePermissionRepository,
    private readonly agentPermissionsRepository: AgentPermissionRepository,
  ) {}

  public async updateOneByAgentId(publicId: string, data: UpdateAgentPermissions) {
    const { permissions } = data;

    const agent: Agent | null = await this.agentRepository.findOneByPublicId(publicId);
    if (!agent) {
      throw new NotFoundException(`${ERROR_MESSAGES.USER_IS_NOT_EXISTS}`);
    }
    try {
      await this.prisma.$transaction(async (tx) => {
        const rolePermissions = await this.getRolePermissions(agent, permissions, tx);

        const filteredIncomingPermissions =
          IncomingPermissionsUtil.mapPermissionsToAgentPermissions(
            agent.id,
            rolePermissions,
            permissions,
          );

        // if (filteredIncomingPermissions.length === 0) {
        //   await this.agentPermissionsRepository.txDeleteManyByAgentId(agent.id, tx);
        //   return agent;
        // }
        //
        // await this.agentPermissionsRepository.txDeleteManyByAgentId(agent.id, tx);
        // await this.agentPermissionsRepository.txCreateMany(filteredIncomingPermissions, tx);
      });
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  public async createOne(input: CreateAgentPermissions): Promise<void> {
    const { agentId, roleId, permissions } = input;
    // Фильтруем входящие разрешения на уникальность permissionId
    const uniqueIncoming = IncomingPermissionsUtil.filterUniquePermissions(permissions);

    try {
      await this.prisma.$transaction(async (tx) => {
        const rolePermissions: RolePermission[] =
          await this.rolePermissionsRepository.txGetManyById(roleId, tx);

        // Выбираем только те разрешения, где значение отличается от дефолтного
        const result: AllowedPermission[] = IncomingPermissionsUtil.filterPermissionsByRoleDefaults(
          uniqueIncoming,
          rolePermissions,
          agentId,
        );

        // Создаем записи в agentPermission, если есть расхождения
        if (result.length > 0) {
          await this.agentPermissionsRepository.txCreateMany(result, tx);
        }
      });
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  // private async updateRoleOnly(agentId: number, roleId: number, tx: Prisma.TransactionClient) {
  //   const updatedAgent = await this.agentRepository.txUpdateOne(agentId, { roleId }, tx, null);
  //
  //   const rolePermissions = await this.rolePermissionsRepository.getManyByIdWithTx(roleId, tx);
  //
  //   const agentPermissions: AgentPermission[] =
  //     await this.agentPermissionsRepository.getManyByAgentIdWithTx(agentId, tx);
  //
  //   if (agentPermissions.length === 0) {
  //     return updatedAgent;
  //   }
  //
  //   const permsToDel = this.getPermissionsToDelete(agentPermissions, rolePermissions);
  //
  //   if (permsToDel.length > 0) {
  //     await this.agentPermissionsRepository.txDeleteManyByAgentIdAndPermsIds(
  //       updatedAgent.id,
  //       permsToDel,
  //       tx,
  //     );
  //   }
  //
  //   return updatedAgent;
  // }

  private async getRolePermissions(
    agent: Agent,
    permissions: IncomingPermission[],
    tx: Prisma.TransactionClient,
  ) {
    const rolePermissions: RolePermission[] =
      await this.rolePermissionsRepository.txGetOneByIdAndPermsIds(agent.roleId, permissions, tx);

    if (rolePermissions.length === 0) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.INVALID_DATA}`);
    }

    return rolePermissions;
  }

  private async updatePermissionsOnly(agent: Agent, permissions: IncomingPermission[]) {
    return agent;
  }

  private async updateRoleAndPermissions(
    agentId: number,
    roleId: number,
    permissions: IncomingPermission[],
    tx: Prisma.TransactionClient,
  ) {
    const updatedAgent = await this.agentRepository.txUpdateOne(agentId, { roleId }, tx, null);
    const rolePermissions = await this.rolePermissionsRepository.txGetOneByIdAndPermsIds(
      updatedAgent.roleId,
      permissions,
      tx,
    );

    if (rolePermissions.length === 0) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.INVALID_DATA}`);
    }

    const filteredIncomingPermissions: AgentPermission[] = [];
    // PermissionsUtil.mapPermissionsToAgentPermissions(agentId, rolePermissions, permissions);

    if (filteredIncomingPermissions.length === 0) {
      await this.agentPermissionsRepository.txDeleteManyByAgentId(updatedAgent.id, tx);
      return updatedAgent;
    }

    await this.agentPermissionsRepository.txDeleteManyByAgentId(updatedAgent.id, tx);
    await this.agentPermissionsRepository.txCreateMany(filteredIncomingPermissions, tx);

    return updatedAgent;
  }

  private getPermissionsToDelete(
    agentPermissions: AgentPermission[],
    rolePermissions: RolePermission[],
  ): number[] {
    return agentPermissions
      .filter((perm) =>
        rolePermissions.some(
          (rp) => rp.permissionId === perm.permissionId && rp.allowed === perm.allowed,
        ),
      )
      .map((perm) => perm.permissionId);
  }
}
