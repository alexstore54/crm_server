import { Injectable } from '@nestjs/common';
import {
  AgentPermissionRepository,
  RolePermissionRepository,
} from '@/modules/permissions/repositories';
import { PrismaService } from '@/shared/db/prisma';
import { AgentPermission, Permission, RolePermission } from '@prisma/client';

@Injectable()
export class PermissionsRepository {
  constructor(
    private readonly agentPermissionsRepository: AgentPermissionRepository,
    private readonly rolePermissionRepository: RolePermissionRepository,
    private readonly prisma: PrismaService,
  ) {}

  public async findAllAgentPermissions(agentId: number, roleId: number): Promise<Permission[]> {
    try {
      const rolePermissions: RolePermission[] =
        await this.rolePermissionRepository.getManyById(roleId);
      const agentPermissions: AgentPermission[] =
        await this.agentPermissionsRepository.getAgentPermissionsByAgentId(agentId);

    } catch (error: any) {}
  }
}
