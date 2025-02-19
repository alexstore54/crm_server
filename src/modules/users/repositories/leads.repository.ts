import { PrismaService } from '@/shared/db/prisma';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Lead } from '@prisma/client';
import { CreateLead } from '@/shared/types/user';
import { UpdateLead } from '@/modules/users/dto/lead';
import { ERROR_MESSAGES } from '@/shared/constants/errors';

@Injectable()
export class LeadRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(): Promise<Lead[]> {
    try {
      return await this.prisma.lead.findMany();
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  async findOneById(id: number): Promise<Lead | null> {
    try {
      return await this.prisma.lead.findFirst({ where: { id } });
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  async findOneByPhone(phone: string): Promise<Lead | null> {
    try {
      return await this.prisma.lead.findFirst({
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

  async createOne(data: CreateLead): Promise<Lead> {
    try {
      return await this.prisma.lead.create({ data });
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  async deleteOneById(id: number): Promise<Lead | null> {
    try {
      return await this.prisma.lead.delete({ where: { id } });
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  async updateOneById(id: number, data: UpdateLead): Promise<Lead | null> {
    const { status_id, ...rest } = data;
    try {
      return await this.prisma.lead.update({
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