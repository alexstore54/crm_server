import { PrismaService } from '@/shared/db/prisma';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Lead } from '@prisma/client';
import { UpdateLead } from '@/modules/user/dto/lead';
import { ERROR_MESSAGES } from '@/shared/constants/errors';
import { CreateLeadInputParams } from '@/modules/user/types';

@Injectable()
export class LeadRepository {
  constructor(private readonly prisma: PrismaService) {}

  public async getAll(): Promise<Lead[]> {
    try {
      return await this.prisma.lead.findMany();
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  public async getLeadsByAgentId(agentId: number): Promise<Lead[]> {
    try {
      return await this.prisma.lead.findMany({
        where: { agentId },
        include: {
          Customer: {
            include: {
              Email: true,
            },
          },
          Agent: true,
          LeadStatus: true,
          Phone: true,
        },
      });
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  public async findOneById(id: number): Promise<Lead | null> {
    try {
      return await this.prisma.lead.findFirst({ where: { id } });
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  public async findOneByPhone(phone: string): Promise<Lead | null> {
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

  async createOne(data: CreateLeadInputParams): Promise<Lead> {
    const { password, emails, phones, ...rest } = data;
    
    try {
      return this.prisma.lead.create({
        data: {
          ...rest,
          Customer: {
            create: {
              password,
              lastOnline: new Date(),
              Email: {
                create: emails.map((email) => ({
                  email: email.email,
                  isMain: email.isMain ?? false,
                })),
              },
            },
          },
          Phone:
            phones && phones.length > 0
              ? {
                  create: phones.map((phone) => ({
                    phone: phone.phone,
                    isMain: phone.isMain ?? false,
                  })),
                }
              : undefined,
        },
        include: {
          Customer: {
            include: { Email: true },
          },
          Phone: true,
        },
      });
    } catch (error: any) {
        throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }
  // public async createOne(data): Promise<Lead> {
  //   try{
  //     return this.prisma.lead.create({
  //       data: {

  //       }
  //     })
  //   }catch(error: any){
  //     throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
  //   }
  // }

  public async deleteOneById(id: number): Promise<Lead | null> {
    try {
      return await this.prisma.lead.delete({ where: { id } });
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  public async updateOneById(id: number, data: UpdateLead): Promise<Lead | null> {
    const { statusId, ...rest } = data;
    try {
      return await this.prisma.lead.update({
        where: { id },
        data: {
          ...rest,
          ...(statusId !== undefined ? { status: { connect: { id: statusId } } } : {}),
        },
      });
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }
}
