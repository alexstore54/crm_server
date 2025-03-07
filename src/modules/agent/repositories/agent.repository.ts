import { PrismaService } from '@/shared/db/prisma';
import { CreateAgent, UpdateAgent } from '@/modules/agent/dto';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Agent, Desk, Prisma } from '@prisma/client';
import { ERROR_MESSAGES } from '@/shared/constants/errors';

@Injectable()
export class AgentRepository {
  constructor(private readonly prisma: PrismaService) {}

  public async getAll(): Promise<Agent[]> {
    try {
      return this.prisma.agent.findMany();
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


  public async createOneWithTx(
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

  public async updateOneWithTx(
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
