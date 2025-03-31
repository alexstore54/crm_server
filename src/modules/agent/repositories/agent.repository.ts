import { PrismaService } from '@/shared/db/prisma';
import { UpdateAgent } from '@/modules/agent/dto';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Agent, Prisma, Role } from '@prisma/client';
import { ERROR_MESSAGES } from '@/shared/constants/errors';
import { CreateAgentInput } from '@/modules/agent/types/repositories.type';

@Injectable()
export class AgentRepository {
  constructor(private readonly prisma: PrismaService) {}

  public async getAll(page: number, limit: number): Promise<Agent[]> {
    try {
      return this.prisma.agent.findMany({
        skip: (page - 1) * limit,
        take: limit,
      });
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  public async findOneById(id: number): Promise<Agent | null> {
    try {
      return this.prisma.agent.findFirst({ where: { id } });
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  public async findOneByPublicId(publicId: string): Promise<Agent | null> {
    try {
      return this.prisma.agent.findFirst({ where: { publicId } });
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  public async txFindOneByPublicId(
    publicId: string,
    tx: Prisma.TransactionClient,
  ): Promise<Agent | null> {
    try {
      return tx.agent.findFirst({ where: { publicId } });
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  public async findOneByPublicIdWithDesks(publicId: string) {
    try {
      return this.prisma.agent.findFirst({
        where: { publicId },
        include: { Desk: true },
      });
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  public async findOneByEmail(email: string): Promise<Agent | null> {
    try {
      return this.prisma.agent.findFirst({ where: { email } });
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  public async findOneByEmailWithDesksAndTeams(email: string) {
    try {
      return this.prisma.agent.findFirst({ where: { email }, include: { Desk: true, Team: true } });
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  public async txFindRoleByAgentId(
    agentId: number,
    tx: Prisma.TransactionClient,
  ): Promise<Role | null> {
    try {
      const agentWithRole = await tx.agent.findFirst({
        where: { id: agentId },
        include: { Role: true },
      });
      return agentWithRole?.Role || null;
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  public async txCreateOne(data: CreateAgentInput, tx: Prisma.TransactionClient) {
    const { input, desks } = data;
    try {
      return tx.agent.create({
        data: {
          ...input,
          Desk:
            desks && desks.length
              ? {
                  connect: desks.map((desk) => ({ id: desk.id })),
                }
              : undefined,
        },
      });
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  public async txUpdateOneById(
    id: number,
    data: UpdateAgent,
    desks: number[] | null,
    avatarURL: string | null,
    tx: Prisma.TransactionClient,
  ) {
    try {
      return tx.agent.update({
        where: { id },
        data: {
          ...data,
          avatarURL,
          Desk: desks
            ? {
                set: desks.map((id) => ({ id })),
              }
            : undefined,
        },
      });
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  public async deleteOneById(id: number): Promise<Agent | null> {
    try {
      return await this.prisma.agent.delete({ where: { id } });
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  public async deleteByPublicId(publicId: string): Promise<Agent | null> {
    try {
      return await this.prisma.agent.delete({ where: { publicId } });
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }
}
