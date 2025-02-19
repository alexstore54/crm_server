import { PrismaService } from '@/shared/db/prisma';
import { Injectable } from '@nestjs/common';
import { Customer, Prisma } from '@prisma/client';
import { UpdateCustomer } from '@/modules/users/dto/customer';
import { CreateCustomer } from '@/modules/users/types';

@Injectable()
export class CustomerRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(): Promise<Customer[]> {
    return this.prisma.customer.findMany();
  }

  async getById(id: number): Promise<Customer | null> {
    return this.prisma.customer.findFirst({ where: { id } });
  }

  async getByUUID(public_id: string): Promise<Customer | null> {
    return this.prisma.customer.findFirst({ where: { public_id } });
  }

  async getByEmail(
    email: string
  ): Promise<Prisma.CustomerGetPayload<{ include: { emails: true } }> | null> {
    return this.prisma.customer.findFirst({
      where: {
        emails: {
          some: { email }
        }
      },
      include: {
        emails: true
      }
    });
  }

  async createCustomer(data: CreateCustomer): Promise<Customer> {
    const { agent_id, lead_id, ...rest } = data;
    return this.prisma.customer.create({
      data: {
        ...rest,
        // Устанавливаем связь с лидом через connect
        leads: { connect: { id: lead_id } },
        // Если агент указан – устанавливаем связь с агентом
        ...(agent_id ? { agent: { connect: { id: agent_id } } } : {}),
      },
    });
  }

  async deleteById(id: number): Promise<Customer | null> {
    return this.prisma.customer.delete({ where: { id } });
  }

  async updateById(id: number, data: UpdateCustomer): Promise<Customer> {
    const { agent_id, lead_id, ...rest } = data;
    return this.prisma.customer.update({
      where: { id },
      data: {
        ...rest,
        // Если необходимо обновить связь с лидом:
        ...(lead_id !== undefined ? { leads: { connect: { id: lead_id } } } : {}),
        // Если необходимо обновить связь с агентом:
        ...(agent_id !== undefined ? { agent: { connect: { id: agent_id } } } : {}),
      },
    });
  }

  async updateByUUID(public_id: string, data: UpdateCustomer): Promise<Customer> {
    const { agent_id, lead_id, ...rest } = data;
    return this.prisma.customer.update({
      where: { public_id },
      data: {
        ...rest,
        // Если необходимо обновить связь с лидом:
        ...(lead_id !== undefined ? { leads: { connect: { id: lead_id } } } : {}),
        // Если необходимо обновить связь с агентом:
        ...(agent_id !== undefined ? { agent: { connect: { id: agent_id } } } : {}),
      },
    });
  }
}
