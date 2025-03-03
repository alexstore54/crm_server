import { PrismaService } from '@/shared/db/prisma';
import { CreateAgent } from '@/modules/agent/dto';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Agent, Desk, Prisma } from '@prisma/client';
import { UpdateAgent } from '@/modules/agent/dto';
import { ERROR_MESSAGES } from '@/shared/constants/errors';

@Injectable()
export class AgentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(): Promise<Agent[]> {
    try {
      return this.prisma.agent.findMany();
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  async findOneById(id: number): Promise<Agent | null> {
    try {
      return this.prisma.agent.findFirst({ where: { id } });
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  async findOneByPublicId(publicId: string): Promise<Agent | null> {
    try {
      return this.prisma.agent.findFirst({ where: { publicId } });
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  async findOneByPublicIdWithDesks(publicId: string) {
    try {
      return this.prisma.agent.findFirst({
        where: { publicId },
        include: { Desk: true },
      });
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  async findOneByEmail(email: string): Promise<Agent | null> {
    try {
      return this.prisma.agent.findFirst({ where: { email } });
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  async findOneByEmailWithDesksAndTeams(email: string) {
    try {
      return this.prisma.agent.findFirst({ where: { email }, include: { Desk: true, Team: true } });
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  async createOneWithTx(
    data: CreateAgent, // данные для создания агента (email, password, roleId, ...)
    tx: Prisma.TransactionClient,
    desks: Desk[] | null,
  ) {
    try {
      return tx.agent.create({
        data: {
          email: data.email,
          password: data.password,
          roleId: data.roleId,

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

  async updateOneWithTx(
    id: number,
    data: UpdateAgent,
    tx: Prisma.TransactionClient,
    desks: number[] | null,
  ) {
    try {
      return tx.agent.update({
        where: { id },
        data: {
          ...data,
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

  // async updateOneById(id: number, data: UpdateAgent): Promise<Agent | null> {
  //   const { deskIds, roleId, ...rest } = data;
  //   try {
  //     return await this.prisma.agent.update({
  //       where: { id },
  //       data: {
  //         ...rest,
  //         ...(roleId !== undefined ? { role: { connect: { id: roleId } } } : {}),
  //         ...(deskIds ? { desks: { set: deskIds.map((id: number) => ({ id })) } } : {}),
  //       },
  //     });
  //   } catch (error: any) {
  //     // Handle error appropriately
  //     throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
  //   }
  // }

  // async updateByPublicId(publicId: string, data: UpdateAgent): Promise<Agent | null> {
  //   const { deskIds, roleId, ...rest } = data;
  //   try {
  //     return await this.prisma.agent.update({
  //       where: { publicId },
  //       data: {
  //         ...rest,
  //         ...(roleId !== undefined ? { role: { connect: { id: roleId } } } : {}),
  //         ...(deskIds ? { desks: { set: deskIds.map((id: number) => ({ id })) } } : {}),
  //       },
  //     });
  //   } catch (error: any) {
  //     // Handle error appropriately
  //     throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
  //   }
  // }
}
