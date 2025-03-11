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

  public async updateByAgentId(publicId: string, data: UpdateAgentPermissions) {
    const { permissions } = data;

    const agent: Agent | null = await this.agentRepository.findOneByPublicId(publicId);
    if (!agent) {
      throw new NotFoundException(`${ERROR_MESSAGES.USER_IS_NOT_EXISTS}`);
    }
    try {

    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  public async create(input: CreateAgentPermissions): Promise<void> {
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


}
