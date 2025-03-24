import { ERROR_MESSAGES } from '@/shared/constants/errors';
import { PrismaService } from '@/shared/db/prisma';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { AgentPermission, Prisma } from '@prisma/client';
import { PrismaPermissionWithDetails } from '@/shared/types/permissions';
import { IncomingPermission } from '@/modules/permissions/dto';
import { AllowedPermission } from '../types';

@Injectable()
export class AgentPermissionRepository {
  constructor(private readonly prisma: PrismaService) {}

  public async txGetManyWithDetailsByAgentId(
    agentId: number,
    tx: Prisma.TransactionClient,
  ): Promise<PrismaPermissionWithDetails[]> {
    try {
      return await tx.agentPermission.findMany({
        where: {
          agentId,
        },
        include: {
          Permission: true,
        },
      });
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  public async txDeleteManyByAgentsIds(ids: number[], tx: Prisma.TransactionClient) {
      return tx.agentPermission.deleteMany({
        where: {
            agentId: {
              in: ids,
            },
        },
      })
  }

  public async txCreateMany(data: AllowedPermission[], tx: Prisma.TransactionClient) {
    return tx.agentPermission.createMany({data});
  }

  

  public async getManyByAgentId(agentId: number) {
    try {
      return this.prisma.agentPermission.findMany({
        where: {
          agentId,
        },
      });
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  public async getManyWithDetailsByAgentId(
    agentId: number,
  ): Promise<PrismaPermissionWithDetails[]> {
    try {
      return this.prisma.agentPermission.findMany({
        where: {
          agentId,
        },
        include: {
          Permission: true,
        },
      });
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  public async createMany(
    agentId: number,
    input: IncomingPermission[],
  ): Promise<AgentPermission[]> {
    try {
      return this.prisma.$transaction((tx) => {
        const createManyPromises = input.map((permission) => {
          return tx.agentPermission.create({
            data: {
              agentId,
              permissionId: permission.id,
            },
          });
        });
        return Promise.all(createManyPromises);
      });
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  public async updateMany(
    agentId: number,
    permissions: IncomingPermission[],
  ): Promise<AgentPermission[]> {
    try {
      return this.prisma.$transaction(async (tx) => {
        await tx.agentPermission.deleteMany({
          where: {
            agentId,
          },
        });

        const createManyPromises = permissions.map((permission) => {
          return tx.agentPermission.create({
            data: {
              agentId,
              permissionId: permission.id,
            },
          });
        });

        const createdPermissions = await Promise.all(createManyPromises);
        return createdPermissions as AgentPermission[];
      });
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }
}
