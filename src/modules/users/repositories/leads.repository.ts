import { PrismaService } from '@/shared/db/prisma';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Leads } from '@prisma/client';
import { CreateLeads } from '@/shared/types/user';
import { UpdateLead } from '@/modules/users/dto/lead';
import { ERROR_MESSAGES } from '@/shared/constants/errors';

@Injectable()
export class LeadRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(): Promise<Leads[]> {
    try {
      return await this.prisma.leads.findMany();
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  async findOneById(id: number): Promise<Leads | null> {
    try {
      return await this.prisma.leads.findFirst({ where: { id } });
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  async findOneByPhone(phone: string): Promise<Leads | null> {
    try {
      return await this.prisma.leads.findFirst({
        where: {
          Phone: {
            some: {
              phone,
            },
          },
        },
        include: {
          Phone: true,
        },
      });
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  async createOne(data: CreateLeads): Promise<Leads> {
    try {
      return await this.prisma.leads.create({ data });
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  async deleteOneById(id: number): Promise<Leads | null> {
    try {
      return await this.prisma.leads.delete({ where: { id } });
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  async updateOneById(id: number, data: UpdateLead): Promise<Leads | null> {
    const { status_id, ...rest } = data;
    try {
      return await this.prisma.leads.update({
        where: { id },
        data: {
          ...rest,
          ...(status_id !== undefined ? { status: { connect: { id: status_id } } } : {}),
        },
      });
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }
}