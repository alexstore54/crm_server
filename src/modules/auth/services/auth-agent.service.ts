import { BadRequestException, Injectable } from '@nestjs/common';
import { SignInAgent } from '@/modules/auth/dto/agent/sign-in.dto';
import { Agent } from '@prisma/client';
import { AgentRepository } from '@/modules/agent/repositories/agent.repository';
import { ERROR_MESSAGES } from '@/shared/constants/errors';
import { BcryptHelper } from '@/shared/helpers';
import { PrismaService } from '@/shared/db/prisma';
import { AgentPermissionRepository, RolePermissionRepository } from '@/modules/agent/repositories';
import { AgentPermissionsUtil } from '@/shared/utils';
@Injectable()
export class AuthAgentService {
  constructor(
      private readonly agentRepository: AgentRepository,
      private readonly agentPermissionsRepository: AgentPermissionRepository,
      private readonly rolePermissionRepository: RolePermissionRepository,
  ) {}

  public async validate(data: SignInAgent): Promise<{agent: Agent, permissions: string[]}> {
    const { email, password } = data;

    const agent = await this.agentRepository.findOneByEmail(email);
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
        permissions: allowedPermissionsArray
    };
  }

  private async getAllowedPermissions(agent: Agent):Promise<string[]>{
      
      const RolePermissions = await this.rolePermissionRepository.getRolePermissionsByRoleId(agent.roleId);
      if(RolePermissions.length === 0){
          throw new BadRequestException(ERROR_MESSAGES.DB_ERROR);
      }
      const AgentPermissions = await this.agentPermissionsRepository.getAgentPermissionsByAgentId(agent.id);
      //Если нет переопределений, то тупо отдаю все разрешения которые доступны
      if(AgentPermissions.length === 0){
          return RolePermissions.filter(perm => perm.allowed).map(p => p.Permission.key);
      }else{
          return AgentPermissionsUtil.mergePermissions(RolePermissions, AgentPermissions);
          
      }

  }
}
 