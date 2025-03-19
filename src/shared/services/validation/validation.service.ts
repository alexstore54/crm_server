import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '@/shared/db/prisma';
import { ERROR_MESSAGES } from '@/shared/constants/errors';
import {
  AgentPermissionValidation,
  GeneralConnects,
  LeadPermissionValidation,
  PermissionOperation,
  TeamsPermissionValidation,
} from '@/shared/types/validation';
import { PERMISSION_CONFIG } from '@/shared/constants/permissions';
import { PermissionsKeys } from '@/shared/types/permissions';

@Injectable()
export class ValidationService {
  constructor(private readonly prisma: PrismaService) {}

  // Main validation methods
  public async validateAgentOperationPermissions(
    args: AgentPermissionValidation,
  ): Promise<boolean> {
    const { permissions, currentAgentPayload, operation } = args;

    const moderatorPermission = PERMISSION_CONFIG.agent.moderator[operation];

    if (permissions.includes(moderatorPermission)) {
      return true;
    }

    const connections = await this.getAgentConnections(args);
    return this.checkAgentPermissions(connections, permissions, operation);
  }

  public async validateLeadOperationPermissions(args: LeadPermissionValidation): Promise<boolean> {
    const { permissions, currentAgentPayload, operation, leadPublicId } = args;
    const moderatorPermission = PERMISSION_CONFIG.lead.moderator[operation];

    if (permissions.includes(moderatorPermission)) {
      return true;
    }

    if (operation !== 'read') {
      return await this.isLeadAssignedToAgent(leadPublicId, currentAgentPayload.sub);
    }

    const connections = await this.getLeadConnections(args);
    return this.checkLeadPermissions(connections, permissions, operation);
  }

  public async validateTeamOperationPermissions(args: TeamsPermissionValidation): Promise<boolean> {
    const { permissions, currentAgentPayload, operation, teamPublicId } = args;
    const moderatorPermission = PERMISSION_CONFIG.team.moderator[operation];

    if (permissions.includes(moderatorPermission)) {
      return true;
    }


    return this.isTeamInOneDesk(teamPublicId, currentAgentPayload.desksPublicId);
  }

  private async getAgentConnections(args: AgentPermissionValidation): Promise<GeneralConnects[]> {
    const { currentAgentPayload, agentPublicId } = args;
    const { sub: currentAgentId } = currentAgentPayload;
    const agentIds = [currentAgentId, agentPublicId];
    const connections: GeneralConnects[] = [];

    if (await this.areAgentsInSameTeam(agentIds, agentPublicId)) {
      connections.push(GeneralConnects.TEAM);
    }
    if (await this.areAgentsInSameDesk(agentIds, agentPublicId)) {
      connections.push(GeneralConnects.DESK);
    }

    return connections;
  }

  private async getLeadConnections(args: LeadPermissionValidation): Promise<GeneralConnects[]> {
    const { currentAgentPayload, leadPublicId } = args;
    const connections: GeneralConnects[] = [];

    if (await this.isLeadInAgentDesk(leadPublicId, currentAgentPayload.desksPublicId)) {
      connections.push(GeneralConnects.DESK);
    }
    if (
      currentAgentPayload.teamsPublicId &&
      (await this.isLeadInAgentTeam(leadPublicId, currentAgentPayload.teamsPublicId))
    ) {
      connections.push(GeneralConnects.TEAM);
    }

    return connections;
  }

  // Database query methods
  private async areAgentsInSameTeam(agentIds: string[], teamId: string): Promise<boolean> {
    try {
      const matchingAgents = await this.prisma.agent.count({
        where: {
          publicId: { in: agentIds },
          Team: { some: { publicId: teamId } },
        },
      });
      return matchingAgents === agentIds.length;
    } catch (error) {
      throw this.createDbError(error);
    }
  }

  private async areAgentsInSameDesk(agentIds: string[], deskId: string): Promise<boolean> {
    try {
      const matchingAgents = await this.prisma.agent.count({
        where: {
          publicId: { in: agentIds },
          Desk: { some: { publicId: deskId } },
        },
      });
      return matchingAgents === agentIds.length;
    } catch (error) {
      throw this.createDbError(error);
    }
  }

  private async isTeamInOneDesk(teamPublicId: string, deskIds: string[]): Promise<boolean> {
    try {
      const desks = await this.prisma.desk.findMany({
        where: {
          publicId: { in: deskIds },
          Teams: { some: { publicId: teamPublicId } },
        },
      });

      return desks.length === deskIds.length;
    } catch (error) {
      throw this.createDbError(error);
    }
  }

  private async isLeadAssignedToAgent(leadId: string, agentId: string): Promise<boolean> {
    try {
      const agent = await this.prisma.agent.findUnique({
        where: { publicId: agentId },
        select: {
          Lead: {
            select: {
              Customer: { where: { publicId: leadId } },
            },
          },
        },
      });
      return !!agent?.Lead?.length;
    } catch (error) {
      throw this.createDbError(error);
    }
  }

  private async isLeadInAgentDesk(leadId: string, deskIds: string[]): Promise<boolean> {
    try {
      const desks = await this.prisma.desk.findMany({
        where: {
          publicId: { in: deskIds },
        },
        select: {
          Lead: {
            select: {
              Customer: {
                where: { publicId: leadId },
              },
            },
          },
        },
      });

      return desks.some((d) => d.Lead && d.Lead.length > 0);
    } catch (error) {
      throw this.createDbError(error);
    }
  }

  private async isLeadInAgentTeam(leadId: string, teamIds: string[]): Promise<boolean> {
    try {
      const teams = await this.prisma.team.findMany({
        where: {
          publicId: { in: teamIds },
        },
        select: {
          Leads: {
            select: {
              Customer: {
                where: { publicId: leadId },
              },
            },
          },
        },
      });

      return teams.some((t) => t.Leads && t.Leads.length > 0);
    } catch (error) {
      throw this.createDbError(error);
    }
  }

  private checkAgentPermissions(
    connections: GeneralConnects[],
    permissions: PermissionsKeys[],
    operation: PermissionOperation,
  ): boolean {
    if (!connections.length) return false;

    const hasDeskOnly =
      connections.includes(GeneralConnects.DESK) && !connections.includes(GeneralConnects.TEAM);
    const hasBoth =
      connections.includes(GeneralConnects.TEAM) && connections.includes(GeneralConnects.DESK);

    if (hasDeskOnly) {
      return permissions.includes(PERMISSION_CONFIG.agent.desk[operation]);
    }
    if (hasBoth) {
      return permissions.includes(PERMISSION_CONFIG.agent.team[operation]);
    }
    return false;
  }

  private checkLeadPermissions(
    connections: GeneralConnects[],
    permissions: PermissionsKeys[],
    operation: PermissionOperation,
  ): boolean {
    if (!connections.length) return false;

    const hasDeskOnly =
      connections.includes(GeneralConnects.DESK) && !connections.includes(GeneralConnects.TEAM);
    const hasBoth =
      connections.includes(GeneralConnects.TEAM) && connections.includes(GeneralConnects.DESK);

    if (hasDeskOnly) {
      return permissions.includes(PERMISSION_CONFIG.lead.desk[operation]);
    }
    if (hasBoth) {
      return permissions.includes(PERMISSION_CONFIG.lead.team[operation]);
    }
    return true;
  }

  private createDbError(error: unknown): InternalServerErrorException {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${message}`);
  }
}
