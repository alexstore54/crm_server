import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { UpdateAgentPermissions } from '@/modules/agent/dto/update-agent-perms.dto';
import { ERROR_MESSAGES } from '@/shared/constants/errors';
import { AgentRepository } from '@/modules/agent/repositories';
import { Agent, AgentPermission, Prisma } from '@prisma/client';
import { CreateAgentPermissions } from '@/modules/permissions/dto/agent-permissions';
import { PrismaPermissionWithDetails } from '@/shared/types/permissions';
import { AgentPermissionRepository } from '@/modules/permissions/repositories';
import { PermissionsService } from '@/modules/permissions/service/permissions.service';

@Injectable()
export class AgentPermissionsService {
  constructor(
    private readonly agentRepository: AgentRepository,
    private readonly agentPermissionRepository: AgentPermissionRepository,
    private readonly permissionsService: PermissionsService,
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

  public async txCreateMany(
    input: CreateAgentPermissions,
    tx: Prisma.TransactionClient,
  ): Promise<PrismaPermissionWithDetails[]> {
    const { agentId, permissions } = input;
    const isPermissionsValid = await this.permissionsService.txIsPermissionsValid(permissions, tx);

    try {
      return this.agentPermissionRepository.txCreateMany({ agentId, permissions }, tx);
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }
}
