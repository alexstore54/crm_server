import { PrismaService } from '@/shared/db/prisma';
import { CreateAgent } from '@/shared/types/agent';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Agent } from '@prisma/client';
import { UpdateAgent } from '@/modules/agents/dto';
import { ERROR_MESSAGES } from '@/shared/constants/errors';

@Injectable()
export class AgentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(): Promise<Agent[]> {
    try {
      return await this.prisma.agent.findMany();
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  async findOneById(id: number): Promise<Agent | null> {
    try {
      return await this.prisma.agent.findFirst({ where: { id } });
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  async findOneByPublicId(publicId: string): Promise<Agent | null> {
    try {
      return await this.prisma.agent.findFirst({ where: { publicId } });
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  async findOneByEmail(email: string): Promise<Agent | null> {
    try {
      return await this.prisma.agent.findFirst({ where: { email } });
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  async createOne(data: CreateAgent): Promise<Agent> {
    const { deskIds, roleId, testPermissions, ...rest } = data;
    try {
      return await this.prisma.agent.create({
        data: {
          ...rest,
          testPermissions,
          ...(roleId ? { role: { connect: { id: roleId } } } : {}),
          ...(deskIds ? { desks: { connect: deskIds.map((id) => ({ id })) } } : {}),
        },
      });
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  async deleteOneById(id: number): Promise<Agent | null> {
    try {
      return await this.prisma.agent.delete({ where: { id } });
    } catch (error: any) {
      // Handle error appropriately
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  async deleteByPublicId(publicId: string): Promise<Agent | null> {
    try {
      return await this.prisma.agent.delete({ where: { publicId } });
    } catch (error: any) {
      // Handle error appropriately
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  async updateOneById(id: number, data: UpdateAgent): Promise<Agent | null> {
    const { desk_ids, role_id, ...rest } = data;
    try {
      return await this.prisma.agent.update({
        where: { id },
        data: {
          ...rest,
          ...(role_id !== undefined ? { role: { connect: { id: role_id } } } : {}),
          ...(desk_ids ? { desks: { set: desk_ids.map((id: number) => ({ id })) } } : {}),
        },
      });
    } catch (error: any) {
      // Handle error appropriately
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  async updateByPublicId(publicId: string, data: UpdateAgent): Promise<Agent | null> {
    const { desk_ids, role_id, ...rest } = data;
    try {
      return await this.prisma.agent.update({
        where: { publicId },
        data: {
          ...rest,
          ...(role_id !== undefined ? { role: { connect: { id: role_id } } } : {}),
          ...(desk_ids ? { desks: { set: desk_ids.map((id: number) => ({ id })) } } : {}),
        },
      });
    } catch (error: any) {
      // Handle error appropriately
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }
}
