import { PrismaService } from '@/shared/db/prisma';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UpdateCustomer } from '@/modules/lead/dto/customer';
import { CreateCustomer } from '@/modules/lead/types';
import { FullLead } from 'shared/types/user';
import { ERROR_MESSAGES } from '@/shared/constants/errors';
import { UsersUtil } from '@/shared/utils';
import { Prisma } from '@prisma/client';

@Injectable()
export class CustomersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(): Promise<FullLead[]> {
    try {
      const customers = await this.prisma.customer.findMany({
        include: {
          Email: true,
          Lead: {
            include: {
              Phone: true,
            },
          },
        },
      });
      return customers.map((customer) =>
        UsersUtil.mapCustomerToFullCustomer(
          customer,
          customer.Lead,
          customer.Lead.Phone,
          customer.Email,
        ),
      );
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  async findOneById(id: number): Promise<FullLead | null> {
    try {
      const customer = await this.prisma.customer.findFirst({
        where: { id },
        include: {
          Email: true,
          Lead: {
            include: {
              Phone: true,
            },
          },
        },
      });
      if (!customer) {
        return null;
      }
      return UsersUtil.mapCustomerToFullCustomer(
        customer,
        customer.Lead,
        customer.Lead.Phone,
        customer.Email,
      );
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  async findOneByLeadId(leadId: number) {
    try {
      return this.prisma.customer.findFirst({
        where: { leadId },
      });
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  async findOneByPublicId(publicId: string): Promise<FullLead | null> {
    try {
      const customer = await this.prisma.customer.findFirst({
        where: { publicId },
        include: {
          Email: true,
          Lead: {
            include: {
              Phone: true,
            },
          },
        },
      });
      if (!customer) {
        return null;
      }
      return UsersUtil.mapCustomerToFullCustomer(
        customer,
        customer.Lead,
        customer.Lead.Phone,
        customer.Email,
      );
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  async findOneByEmail(email: string): Promise<FullLead | null> {
    try {
      const customer = await this.prisma.customer.findFirst({
        where: {
          Email: {
            some: { email },
          },
        },
        include: {
          Email: true,
          Lead: {
            include: {
              Phone: true,
            },
          },
        },
      });
      if (!customer) {
        return null;
      }
      return UsersUtil.mapCustomerToFullCustomer(
        customer,
        customer.Lead,
        customer.Lead.Phone,
        customer.Email,
      );
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }
  async createOneWithTx(data: CreateCustomer, tx: Prisma.TransactionClient): Promise<FullLead> {
    const { leadId, ...rest } = data;
    try {
      const customer = await tx.customer.create({
        data: {
          ...rest,
          Lead: { connect: { id: leadId } },
        },
        include: {
          Email: true,
          Lead: {
            include: {
              Phone: true,
            },
          },
        },
      });
      return UsersUtil.mapCustomerToFullCustomer(
        customer,
        customer.Lead,
        customer.Lead.Phone,
        customer.Email,
      );
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  async createOne(data: CreateCustomer): Promise<FullLead> {
    const { leadId, ...rest } = data;
    try {
      const customer = await this.prisma.customer.create({
        data: {
          ...rest,
          Lead: { connect: { id: leadId } },
        },
        include: {
          Email: true,
          Lead: {
            include: {
              Phone: true,
            },
          },
        },
      });
      return UsersUtil.mapCustomerToFullCustomer(
        customer,
        customer.Lead,
        customer.Lead.Phone,
        customer.Email,
      );
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }
  async deleteOneById(id: number): Promise<FullLead | null> {
    try {
      const customer = await this.prisma.customer.delete({
        where: { id },
        include: {
          Email: true,
          Lead: {
            include: {
              Phone: true,
            },
          },
        },
      });
      return UsersUtil.mapCustomerToFullCustomer(
        customer,
        customer.Lead,
        customer.Lead.Phone,
        customer.Email,
      );
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  async updateOneById(id: number, data: UpdateCustomer): Promise<FullLead> {
    const { agent_id, lead_id, ...rest } = data;
    try {
      const customer = await this.prisma.customer.update({
        where: { id },
        data: {
          ...rest,
          ...(lead_id !== undefined ? { leads: { connect: { id: lead_id } } } : {}),
          ...(agent_id !== undefined ? { agent: { connect: { id: agent_id } } } : {}),
        },
        include: {
          Email: true,
          Lead: {
            include: {
              Phone: true,
            },
          },
        },
      });
      return UsersUtil.mapCustomerToFullCustomer(
        customer,
        customer.Lead,
        customer.Lead.Phone,
        customer.Email,
      );
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  async updateOneByPublicId(publicId: string, data: UpdateCustomer): Promise<FullLead> {
    const { agent_id, lead_id, ...rest } = data;
    try {
      const customer = await this.prisma.customer.update({
        where: { publicId },
        data: {
          ...rest,
          ...(lead_id !== undefined ? { leads: { connect: { id: lead_id } } } : {}),
          ...(agent_id !== undefined ? { agent: { connect: { id: agent_id } } } : {}),
        },
        include: {
          Email: true,
          Lead: {
            include: {
              Phone: true,
            },
          },
        },
      });
      return UsersUtil.mapCustomerToFullCustomer(
        customer,
        customer.Lead,
        customer.Lead.Phone,
        customer.Email,
      );
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }
}
