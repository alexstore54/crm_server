import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { UpdateAgentPerms } from '@/modules/agent/dto/update-agent-perms.dto';
import { ERROR_MESSAGES } from '@/shared/constants/errors';
import { PrismaService } from '@/shared/db/prisma';
import {
  AgentPermissionRepository,
  AgentRepository,
  RolePermissionRepository,
} from '@/modules/agent/repositories';
import { Agent, AgentPermission, Prisma, RolePermission } from '@prisma/client';
import { IncomingPermission } from '@/modules/permissions/dto/agent-permissions';
import { PermissionsUtil } from '@/shared/utils/permissions/permissions.util';

@Injectable()
export class AgentPermissionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly agentRepository: AgentRepository,
    private readonly rolePermissionRepository: RolePermissionRepository,
    private readonly agentPermissionRepository: AgentPermissionRepository,
  ) {}

  public async updateOneByAgentPublicId(publicId: string, data: UpdateAgentPerms) {
    const { roleId, permissions } = data;

    const agent: Agent | null = await this.agentRepository.findOneByPublicId(publicId);
    if (!agent) {
      throw new NotFoundException(`${ERROR_MESSAGES.USER_IS_NOT_EXISTS}`);
    }

    try {
      return await this.prisma.$transaction(async (tx) => {
        if (roleId && !permissions) {
          return this.updateRoleOnly(agent.id, roleId, tx);
        } else if (!roleId && permissions) {
          return this.updatePermissionsOnly(agent, permissions, tx);
        } else if (roleId && permissions) {
          return this.updateRoleAndPermissions(agent.id, roleId, permissions, tx);
        } else {
          throw new InternalServerErrorException(`${ERROR_MESSAGES.INVALID_DATA}`);
        }
      });
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR + error.message}`);
    }
  }

  private async updateRoleOnly(agentId: number, roleId: number, tx: Prisma.TransactionClient) {
    const updatedAgent = await this.agentRepository.updateOneWithTx(agentId, { roleId }, tx, null);

    const rolePermissions = await this.rolePermissionRepository.getManyByRoleIdWithTx(roleId, tx);

    const agentPermissions: AgentPermission[] =
      await this.agentPermissionRepository.getManyByAgentIdWithTx(agentId, tx);

    if (agentPermissions.length === 0) {
      return updatedAgent;
    }

    const permsToDel = this.getPermissionsToDelete(agentPermissions, rolePermissions);

    if (permsToDel.length > 0) {
      await this.agentPermissionRepository.deleteManyByAgentIdAndPermsIdsWithTx(
        updatedAgent.id,
        permsToDel,
        tx,
      );
    }

    return updatedAgent;
  }

  private async updatePermissionsOnly(
    agent: Agent,
    permissions: IncomingPermission[],
    tx: Prisma.TransactionClient,
  ) {
    const rolePermissions: RolePermission[] =
      await this.rolePermissionRepository.getOneByRoleIdAndPermsIdsWithTx(
        agent.roleId,
        permissions,
        tx,
      );

    if (rolePermissions.length === 0) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.INVALID_DATA}`);
    }

    const filteredIncomingPermissions = PermissionsUtil.mapPermissionsToAgentPermissions(
      agent.id,
      rolePermissions,
      permissions,
    );

    if (filteredIncomingPermissions.length === 0) {
      await this.agentPermissionRepository.deleteManyByAgentIdWithTx(agent.id, tx);
      return agent;
    }

    await this.agentPermissionRepository.deleteManyByAgentIdWithTx(agent.id, tx);
    await this.agentPermissionRepository.createManyWithTx(filteredIncomingPermissions, tx);

    return agent;
  }

  private async updateRoleAndPermissions(
    agentId: number,
    roleId: number,
    permissions: IncomingPermission[],
    tx: Prisma.TransactionClient,
  ) {
    const updatedAgent = await this.agentRepository.updateOneWithTx(agentId, { roleId }, tx, null);
    const rolePermissions = await this.rolePermissionRepository.getOneByRoleIdAndPermsIdsWithTx(
      updatedAgent.roleId,
      permissions,
      tx,
    );

    if (rolePermissions.length === 0) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.INVALID_DATA}`);
    }

    const filteredIncomingPermissions: AgentPermission[] =
      PermissionsUtil.mapPermissionsToAgentPermissions(agentId, rolePermissions, permissions);

    if (filteredIncomingPermissions.length === 0) {
      await this.agentPermissionRepository.deleteManyByAgentIdWithTx(updatedAgent.id, tx);
      return updatedAgent;
    }

    await this.agentPermissionRepository.deleteManyByAgentIdWithTx(updatedAgent.id, tx);
    await this.agentPermissionRepository.createManyWithTx(filteredIncomingPermissions, tx);

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
