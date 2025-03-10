import { ERROR_MESSAGES } from '@/shared/constants/errors';
import { PrismaService } from '@/shared/db/prisma';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { AgentPermission, Prisma } from '@prisma/client';
import { PrismaPermissionWithDetails } from '@/shared/types/permissions';

@Injectable()
export class AgentPermissionRepository {
  constructor(private readonly prisma: PrismaService) {}

  public async getManyByAgentIdWithTx(
    agentId: number,
    tx: Prisma.TransactionClient,
  ): Promise<AgentPermission[]> {
    try {
      return tx.agentPermission.findMany({
        where: {
          agentId,
        },
      });
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

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

  public async txCreateMany(data: AgentPermission[], tx: Prisma.TransactionClient) {
    try {
      return tx.agentPermission.createMany({ data });
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  public async txDeleteManyByAgentIdAndPermsIds(
    agentId: number,
    permissionIds: number[],
    tx: Prisma.TransactionClient,
  ) {
    try {
      return tx.agentPermission.deleteMany({
        where: {
          agentId,
          permissionId: { in: permissionIds },
        },
      });
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  public async txDeleteManyByAgentId(agentId: number, tx: Prisma.TransactionClient) {
    try {
      return tx.agentPermission.deleteMany({
        where: {
          agentId,
        },
      });
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }
}
