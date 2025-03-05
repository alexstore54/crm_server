import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '@/shared/db/prisma';
import { ERROR_MESSAGES } from '@/shared/constants/errors';
import {
  AgentPermissionValidation,
  GeneralConnects,
  LeadPermissionValidation,
  ValidationOperation,
} from '@/shared/types/validation';
import { AgentAuthPayload, PermissionsKeys } from '@/shared/types/auth';

@Injectable()
export class ValidationService {
  constructor(private readonly prisma: PrismaService) {}

  public async validateAgentOperationPermissions(
    args: AgentPermissionValidation,
  ): Promise<boolean> {
    const { permissions, agentId, currentAgentPayload, operation } = args;
    const { sub } = currentAgentPayload;
    //проверяем есть ли админский пермишн в зависимости от типа операции
    const moderatorPermission = this.getModeratorPermissionByAgentOperation(operation);
    if (permissions.includes(moderatorPermission)) {
      return true;
    }
    //общие связи между агентами
    const general: GeneralConnects[] = await this.getAgentGeneralConnects(sub, agentId);

    return this.validateAgentPermissions(general, permissions, operation);
  }

  public async validateLeadOperationPermissions(args: LeadPermissionValidation): Promise<boolean> {
    const { permissions, leadPublicId, currentAgentPayload, operation } = args;
    //проверяем есть ли админский пермишн
    const moderatorPermission = this.getModeratorPermissionByLeadOperation(operation);
    if (permissions.includes(moderatorPermission)) {
      return true;
    }

    const general = await this.getLeadGeneralConnects(currentAgentPayload, leadPublicId);

    return this.validateLeadPermissions(general, currentAgentPayload, permissions, operation);
  }

  public async getAgentGeneralConnects(
    currentAgentPublicId: string,
    agentPublicId: string,
  ): Promise<GeneralConnects[]> {
    const general: GeneralConnects[] = [];

    const isAgentInOneTeam = await this.isAgentsInOneTeam(
      [currentAgentPublicId, agentPublicId],
      agentPublicId,
    );
    const isAgentInOneDesk = await this.isAgentsInOneDesk(
      [currentAgentPublicId, agentPublicId],
      agentPublicId,
    );

    if (isAgentInOneTeam) {
      general.push(GeneralConnects.TEAM);
    }
    if (isAgentInOneDesk) {
      general.push(GeneralConnects.DESK);
    }

    return general;
  }

  public async getLeadGeneralConnects(
    agentPayload: AgentAuthPayload,
    leadPublicId: string,
  ): Promise<GeneralConnects[]> {
    const general: GeneralConnects[] = [];
    const isLeadInDesk = await this.isLeadInDesk(leadPublicId, agentPayload.deskPublicId);
    if (isLeadInDesk) {
      general.push(GeneralConnects.DESK);
    }
    //#TODO: IMPLEMENT  IS LEAD IN TEAM

    return general;
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

  public async isLeadPassedToAgent(leadPublicId: string, agentPublicId: string): Promise<boolean> {
    try {
      const agent = await this.prisma.agent.findUnique({
        where: {
          publicId: agentPublicId,
        },
        include: {
          Lead: {
            select: {
              Customer: {
                where: {
                  publicId: leadPublicId,
                },
              },
            },
          },
        },
      });

      return agent !== null;
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  public async isLeadInDesk(leadPublicId: string, deskPublicId: string): Promise<boolean> {
    try {
      const desk = await this.prisma.desk.findUnique({
        where: {
          publicId: deskPublicId,
        },
        include: {
          Lead: {
            select: {
              Customer: {
                where: {
                  publicId: leadPublicId,
                },
              },
            },
          },
        },
      });

      return desk !== null;
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  private validateAgentPermissions(
    general: GeneralConnects[],
    permissions: PermissionsKeys[],
    operation: ValidationOperation,
  ): boolean {
    //если нет общих связей, то нет и доступа
    if (general.length === 0) {
      return false;
    }

    // если есть общий деск, но нет общей команды
    //(разные команды) тогда нам нужно разрешение на desk
    if (general.includes(GeneralConnects.DESK) && !general.includes(GeneralConnects.TEAM)) {
      const neededPermissionByDesk: PermissionsKeys =
        this.getAgentNeedDeskPermissionByOperation(operation);

      return permissions.includes(neededPermissionByDesk);
    }

    // если общая команда (деск всегда один для команды)
    if (general.includes(GeneralConnects.TEAM) && general.includes(GeneralConnects.DESK)) {
      const neededPermissionByLead: PermissionsKeys =
        this.getAgentNeedTeamPermissionByOperation(operation);

      return permissions.includes(neededPermissionByLead);
    }

    //в других случаях false
    return false;
  }

  private validateLeadPermissions(
    general: GeneralConnects[],
    agentPayload: AgentAuthPayload,
    permissions: PermissionsKeys[],
    operation: ValidationOperation,
  ): boolean {
    const { sub: agentPublicId, deskPublicId, teamPublicId } = agentPayload;

    if (general.length === 0) {
      return false;
    }

    if (general.includes(GeneralConnects.DESK) && !general.includes(GeneralConnects.TEAM)) {
      const neededPermissionByDesk: PermissionsKeys =
        this.getLeadNeedDeskPermissionByOperation(operation);
      return permissions.includes(neededPermissionByDesk);
    }

    if (general.includes(GeneralConnects.TEAM) && general.includes(GeneralConnects.DESK)) {
      const neededPermissionByLead: PermissionsKeys =
        this.getLeadNeedTeamPermissionByOperation(operation);
      return permissions.includes(neededPermissionByLead);
    }

    return true;
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

  private getAgentNeedDeskPermissionByOperation = (operation: ValidationOperation) => {
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

  private getAgentNeedTeamPermissionByOperation = (operation: ValidationOperation) => {
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

  private getLeadNeedDeskPermissionByOperation = (operation: ValidationOperation) => {
    switch (operation) {
      case 'create':
        return PermissionsKeys.CREATE_DESK_LEADS;
      case 'update':
        return PermissionsKeys.UPDATE_DESK_LEADS;
      case 'delete':
        return PermissionsKeys.DELETE_DESK_LEADS;
      case 'read':
        return PermissionsKeys.READ_DESK_LEADS;
    }
  };

  private getLeadNeedTeamPermissionByOperation = (operation: ValidationOperation) => {
    switch (operation) {
      case 'create':
        return PermissionsKeys.CREATE_TEAM_LEADS;
      case 'update':
        return PermissionsKeys.UPDATE_TEAM_LEADS;
      case 'delete':
        return PermissionsKeys.DELETE_TEAM_LEADS;
      case 'read':
        return PermissionsKeys.READ_TEAM_LEADS;
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
