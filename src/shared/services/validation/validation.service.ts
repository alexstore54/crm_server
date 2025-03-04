import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '@/shared/db/prisma';
import { ERROR_MESSAGES } from '@/shared/constants/errors';
import {
  AgentPermissionValidation,
  GeneralEntities,
  ValidationOperation,
} from '@/shared/types/validation';
import { PermissionsKeys } from '@/shared/types/auth';

@Injectable()
export class ValidationService {
  constructor(private readonly prisma: PrismaService) {}

  public async validateAgentOperationPermissions(
    args: AgentPermissionValidation,
  ): Promise<boolean> {
    const { permissions, agentId, currentAgentId, operation } = args;
    //проверяем есть ли админский пермишн в зависимости от типа операции
    const adminPermissions = this.getModeratorPermissionByAgentOperation(operation);
    if (permissions.includes(adminPermissions)) {
      return true;
    }

    //общие связи между агентами
    const general: GeneralEntities[] = await this.getAgentGeneralConnects(currentAgentId, agentId);

    return this.validateAgentPermissions(general, permissions, operation);
  }

  public async validateLeadOperationPermissions() {}

  public async getAgentGeneralConnects(
    currentAgentPublicId: string,
    agentPublicId: string,
  ): Promise<GeneralEntities[]> {
    const entities: GeneralEntities[] = [];

    const isAgentInOneTeam = await this.isAgentsInOneTeam(
      [currentAgentPublicId, agentPublicId],
      agentPublicId,
    );
    const isAgentInOneDesk = await this.isAgentsInOneDesk(
      [currentAgentPublicId, agentPublicId],
      agentPublicId,
    );

    if (isAgentInOneTeam) {
      entities.push(GeneralEntities.TEAM);
    }
    if (isAgentInOneDesk) {
      entities.push(GeneralEntities.DESK);
    }

    return entities;
  }

  public async isAgentsInOneTeam(publicIds: string[], publicTeamId: string): Promise<boolean> {
    try {
      const agents = await this.prisma.agent.findMany({
        where: {
          publicId: { in: publicIds },
          Team: {
            some: {
              publicId: publicTeamId,
            },
          },
        },
      });
      return agents.length === publicIds.length;
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  public async isAgentsInOneDesk(publicIds: string[], deskPublicId: string): Promise<boolean> {
    try {
      const agents = await this.prisma.agent.findMany({
        where: {
          publicId: { in: publicIds },
          Desk: {
            some: {
              publicId: deskPublicId,
            },
          },
        },
      });
      return agents.length === publicIds.length;
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  private validateAgentPermissions(
    general: GeneralEntities[],
    permissions: PermissionsKeys[],
    operation: ValidationOperation,
  ): boolean {
    //если нет общих связей, то нет и доступа
    if (general.length === 0) {
      return false;
    }

    // если есть общий деск, но нет общей команды
    //(разные команды) тогда нам нужно разрешение на desk
    if (general.includes(GeneralEntities.DESK) && !general.includes(GeneralEntities.TEAM)) {
      const neededPermissionByDesk: PermissionsKeys =
        this.getNeedDeskPermissionByOperation(operation);

      return permissions.includes(neededPermissionByDesk);
    }

    // если общая команда (деск всегда один для команды)
    if (general.includes(GeneralEntities.TEAM) && !general.includes(GeneralEntities.DESK)) {
      const neededPermissionByLead: PermissionsKeys =
        this.getNeedTeamPermissionByOperation(operation);

      return permissions.includes(neededPermissionByLead);
    }

    //в других случаях false
    return false;
  }

  private getModeratorPermissionByAgentOperation = (
    operation: ValidationOperation,
  ): PermissionsKeys => {
    switch (operation) {
      case 'create':
        return PermissionsKeys.CREATE_AGENTS;
      case 'update':
        return PermissionsKeys.UPDATE_ALL_AGENTS;
      case 'delete':
        return PermissionsKeys.DELETE_ALL_AGENTS;
      case 'read':
        return PermissionsKeys.READ_ALL_AGENTS;
    }
  };

  private getNeedDeskPermissionByOperation = (operation: ValidationOperation) => {
    switch (operation) {
      case 'create':
        return PermissionsKeys.CREATE_DESK_AGENTS;
      case 'update':
        return PermissionsKeys.UPDATE_DESK_AGENTS;
      case 'delete':
        return PermissionsKeys.DELETE_DESK_AGENTS;
      case 'read':
        return PermissionsKeys.READ_DESK_AGENTS;
    }
  };
  private getNeedTeamPermissionByOperation = (operation: ValidationOperation) => {
    switch (operation) {
      case 'create':
        return PermissionsKeys.CREATE_TEAM_AGENTS;
      case 'update':
        return PermissionsKeys.UPDATE_TEAM_AGENTS;
      case 'delete':
        return PermissionsKeys.DELETE_TEAM_AGENTS;
      case 'read':
        return PermissionsKeys.READ_TEAM_AGENTS;
    }
  };

  private getModeratorPermissionByLeadOperation = (operation: ValidationOperation) => {
    switch (operation) {
      case 'create':
        return PermissionsKeys.CREATE_ALL_LEADS;
      case 'update':
        return PermissionsKeys.UPDATE_ALL_LEADS;
      case 'delete':
        return PermissionsKeys.DELETE_ALL_LEADS;
      case 'read':
        return PermissionsKeys.READ_ALL_LEADS;
    }
  };
}
