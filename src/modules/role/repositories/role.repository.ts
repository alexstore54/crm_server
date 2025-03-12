import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/db/prisma';
import { getMockedRole } from '@/shared/mocks/role/role.mock';
import { Role } from '@prisma/client';

@Injectable()
export class RoleRepository {
  constructor(private readonly prisma: PrismaService) {}

  public async findOneByPublicId(publicId: string): Promise<Role> {

    //TODO: Implement this method

    // try {
    //   return this.prisma.role.findUnique({
    //     where: {
    //       publicId: publicId,
    //     },
    //   });
    // } catch (error: any) {
    //   throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    // }
    return getMockedRole();
  }
}
