import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '@/shared/db/prisma';
import { ERROR_MESSAGES } from '@/shared/constants/errors';
import {
  DESK_AGENT_PERMISSIONS,
  PermissionsKeys,
  TEAM_AGENT_PERMISSIONS,
} from '@/shared/types/auth';
import { ValidatePermissionsArgs } from '@/shared/types/redis';

@Injectable()
export class ValidationService {
  constructor(private readonly prisma: PrismaService) {}

  public async validatePermissions(
    permissions: PermissionsKeys[],
    data: ValidatePermissionsArgs,
  ): Promise<boolean> {
    for (const permission of permissions) {
      const isPermissionValid = await this.validatePermission(permission, data);
      if (!isPermissionValid) {
        return false;
      }
    }

    return true;
  }

  private async validatePermission(
    permission: PermissionsKeys,
    data: ValidatePermissionsArgs,
  ): Promise<boolean> {
    const { agentPayload, checkedPublicId } = data;
    const { sub, deskPublicId, teamPublicId } = agentPayload;
    const publicIds = [checkedPublicId, sub];

    if (TEAM_AGENT_PERMISSIONS.some((value) => value === permission)) {
      return this.isAgentsInOneTeam(publicIds, teamPublicId);
    }

    if (DESK_AGENT_PERMISSIONS.some((value) => value === permission)) {
      return this.isAgentsInOneDesk(publicIds, teamPublicId);
    }

    return false;
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
}
