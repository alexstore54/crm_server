import { BadRequestException, Injectable } from '@nestjs/common';
import { SignInAgent } from '@/modules/auth/dto/agent/sign-in.dto';
import { Agent, AgentPermission, RolePermission } from '@prisma/client';
import { AgentRepository } from '@/modules/agent/repositories/agent.repository';
import { ERROR_MESSAGES } from '@/shared/constants/errors';
import { BcryptHelper } from '@/shared/helpers';
import { AgentPermissionRepository, RolePermissionRepository } from '@/modules/agent/repositories';
import { AgentPermissionsUtil, RolePermissionWithPermission } from '@/shared/utils';
import { AuthAgentLoginInput } from '@/modules/auth/types/auth.type';
import { Permissions } from '@/shared/types/redis';

@Injectable()
export class AuthAgentService {
  constructor(
    private readonly agentRepository: AgentRepository,
    private readonly agentPermissionsRepository: AgentPermissionRepository,
    private readonly rolePermissionRepository: RolePermissionRepository,
  ) {}

  public async validate(data: SignInAgent): Promise<AuthAgentLoginInput> {
    const { email, password } = data;

    const agent = await this.agentRepository.findOneByEmailWithDesksAndTeams(email);
    if (!agent) {
      throw new BadRequestException(ERROR_MESSAGES.INVALID_CREDS);
    }
    
    const isPasswordMatch = await BcryptHelper.compare(password, agent.password);
    if (!isPasswordMatch) {
      throw new BadRequestException(ERROR_MESSAGES.INVALID_CREDS);
    }
    const allowedPermissionsArray = await this.getAllowedPermissions(agent);

    return {
      agent,
      permissions: allowedPermissionsArray,
      deskPublicId: agent.Desk[0]?.publicId, // Массив объектов Desk, связанных с агентом
      teamPublicId: agent.Team[0]?.publicId  // Массив объектов Team, связанных с агентом
    };
  }

  private async getAllowedPermissions(agent: Agent): Promise<string[]> {
    const rolePermissions: RolePermissionWithPermission[] =
      await this.rolePermissionRepository.getRolePermissionsByRoleId(agent.roleId);

    if (rolePermissions.length === 0) {
      throw new BadRequestException(ERROR_MESSAGES.DB_ERROR);
    }

    const agentPermissions: AgentPermission[]  =
      await this.agentPermissionsRepository.getAgentPermissionsByAgentId(agent.id);

    if (agentPermissions.length === 0) {
      return rolePermissions.filter((perm) => perm.allowed).map((p) => p.Permission.key);
    } else {
      return AgentPermissionsUtil.mergePermissions(rolePermissions, agentPermissions);
    }
  }
}
 