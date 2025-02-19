import { PrismaService } from '@/shared/db/prisma';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UpdateCustomer } from '@/modules/users/dto/customer';
import { CreateCustomer } from '@/modules/users/types';
import { FullCustomer } from '@/shared/types/user';
import { ERROR_MESSAGES } from '@/shared/constants/errors';
import { UsersUtil } from '@/shared/utils';

@Injectable()
export class CustomersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(): Promise<FullCustomer[]> {
    try {
      const customers = await this.prisma.customer.findMany({
        include: {
          emails: true,
          leads: {
            include: {
              Phone: true,
            },
          },
        },
      });
      return customers.map((customer) =>
        UsersUtil.mapCustomerToFullCustomer(
          customer,
          customer.leads,
          customer.leads.Phone,
          customer.emails,
        ),
      );
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  async findOneById(id: number): Promise<FullCustomer | null> {
    try {
      const customer = await this.prisma.customer.findFirst({
        where: { id },
        include: {
          emails: true,
          leads: {
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
        customer.leads,
        customer.leads.Phone,
        customer.emails,
      );
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  async findOneByPublicId(publicId: string): Promise<FullCustomer | null> {
    try {
      const customer = await this.prisma.customer.findFirst({
        where: { public_id: publicId },
        include: {
          emails: true,
          leads: {
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
        customer.leads,
        customer.leads.Phone,
        customer.emails,
      );
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  async findOneByEmail(email: string): Promise<FullCustomer | null> {
    try {
      const customer = await this.prisma.customer.findFirst({
        where: {
          emails: {
            some: { email },
          },
        },
        include: {
          emails: true,
          leads: {
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
        customer.leads,
        customer.leads.Phone,
        customer.emails,
      );
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  async createOne(data: CreateCustomer): Promise<FullCustomer> {
    const { agentId, leadId, ...rest } = data;
    try {
      const customer = await this.prisma.customer.create({
        //@ts-ignore
        data: {
          ...rest,
          leads: { connect: { id: leadId } },
          ...(agentId ? { agent: { connect: { id: agentId } } } : {}),
        },
        include: {
          emails: true,
          leads: {
            include: {
              Phone: true,
            },
          },
        },
      });
      return UsersUtil.mapCustomerToFullCustomer(
        customer,
        customer.leads,
        customer.leads.Phone,
        customer.emails,
      );
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  async deleteOneById(id: number): Promise<FullCustomer | null> {
    try {
      const customer = await this.prisma.customer.delete({
        where: { id },
        include: {
          emails: true,
          leads: {
            include: {
              Phone: true,
            },
          },
        },
      });
      return UsersUtil.mapCustomerToFullCustomer(
        customer,
        customer.leads,
        customer.leads.Phone,
        customer.emails,
      );
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  async updateOneById(id: number, data: UpdateCustomer): Promise<FullCustomer> {
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
          emails: true,
          leads: {
            include: {
              Phone: true,
            },
          },
        },
      });
      return UsersUtil.mapCustomerToFullCustomer(
        customer,
        customer.leads,
        customer.leads.Phone,
        customer.emails,
      );
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  async updateOneByPublicId(publicId: string, data: UpdateCustomer): Promise<FullCustomer> {
    const { agent_id, lead_id, ...rest } = data;
    try {
      const customer = await this.prisma.customer.update({
        where: { public_id: publicId },
        data: {
          ...rest,
          ...(lead_id !== undefined ? { leads: { connect: { id: lead_id } } } : {}),
          ...(agent_id !== undefined ? { agent: { connect: { id: agent_id } } } : {}),
        },
        include: {
          emails: true,
          leads: {
            include: {
              Phone: true,
            },
          },
        },
      });
      return UsersUtil.mapCustomerToFullCustomer(
        customer,
        customer.leads,
        customer.leads.Phone,
        customer.emails,
      );
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }
}