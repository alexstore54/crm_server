import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { UpdateAgentPermissions } from '@/modules/agent/dto/update-agent-perms.dto';
import { ERROR_MESSAGES } from '@/shared/constants/errors';
import { AgentPermissionRepository, AgentRepository } from '@/modules/agent/repositories';
import { Agent, AgentPermission } from '@prisma/client';
import { CreateAgentPermissions } from '@/modules/permissions/dto/agent-permissions';
import { PrismaPermissionWithDetails } from '@/shared/types/permissions';

@Injectable()
export class AgentPermissionsService {
  constructor(
    private readonly agentRepository: AgentRepository,
    private readonly agentPermissionRepository: AgentPermissionRepository,
  ) {}

  public async getPermissionsByAgentPublicId(publicId: string) {
    const agent: Agent | null = await this.agentRepository.findOneByPublicId(publicId);
    if (!agent) {
      throw new NotFoundException(`${ERROR_MESSAGES.USER_IS_NOT_EXISTS}`);
    }
    try {
      return this.agentPermissionRepository.getManyByAgentId(agent.id);
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  public async updateManyByAgentId(publicId: string, data: UpdateAgentPermissions) {
    const { permissions } = data;

    const agent: Agent | null = await this.agentRepository.findOneByPublicId(publicId);
    if (!agent) {
      throw new NotFoundException(`${ERROR_MESSAGES.USER_IS_NOT_EXISTS}`);
    }

    try {
      return this.agentPermissionRepository.updateMany(agent.id, permissions);

      //TODO: Implement socket logic
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  public async getManyByAgentId(agentId: number): Promise<AgentPermission[]> {
    try {
      return this.agentPermissionRepository.getManyByAgentId(agentId);
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  public async getManyWithDetailsByAgentId(
    agentId: number,
  ): Promise<PrismaPermissionWithDetails[]> {
    try {
      return this.agentPermissionRepository.getManyWithDetailsByAgentId(agentId);
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  public async createMany(input: CreateAgentPermissions): Promise<AgentPermission[]> {
    const { agentId, permissions } = input;
    
    try {
      return this.agentPermissionRepository.createMany(agentId, permissions);
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }
}
