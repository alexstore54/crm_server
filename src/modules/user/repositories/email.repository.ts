import { PrismaService } from '@/shared/db/prisma';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailRepository {
  constructor(private readonly prisma: PrismaService) {}

  public async createOne(email: string, customerId: number) {
    return this.prisma.email.create({
      data: {
        email,
        customerId,
      },
    });
  }
}
