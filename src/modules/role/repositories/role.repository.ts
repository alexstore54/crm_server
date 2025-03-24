import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '@/shared/db/prisma';
import { Prisma, Role } from '@prisma/client';
import { ERROR_MESSAGES } from '@/shared/constants/errors';
import { PrismaPermissionWithDetails } from '@/shared/types/permissions';
import { UpdateRole } from '@/modules/role/dto';

@Injectable()
export class RoleRepository {
  constructor(private readonly prisma: PrismaService) {}

  public async findOneByPublicId(publicId: string): Promise<Role | null> {
    try {
      return this.prisma.role.findUnique({
        where: {
          publicId: publicId,
        },
      });
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  public async createOne(name: string): Promise<Role> {
    try {
      return this.prisma.role.create({
        data: {
          name,
        },
      });
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  public async txFindOneByPublicId(
    publicId: string,
    tx: Prisma.TransactionClient,
  ): Promise<Role | null> {
    try {
      return tx.role.findUnique({
        where: {
          publicId: publicId,
        },
      });
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  public async txFindOneById(id: number, tx: Prisma.TransactionClient) {
    return tx.role.findFirst({ where: { id } });
  }

  public async findOneFull(
    publicId: string,
  ): Promise<{ role: Role; permissions: PrismaPermissionWithDetails[] } | null> {
    try {
      return this.prisma.$transaction(async (tx) => {
        const role = await tx.role.findUnique({
          where: {
            publicId,
          },
        });

        if (!role) {
          return null;
        }

        const permissions = await tx.rolePermission.findMany({
          where: {
            roleId: role.id,
          },
          include: {
            Permission: true,
          },
        });

        return {
          role,
          permissions,
        };
      });
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  public async findMany(page: number, limit: number): Promise<Role[]> {
    try {
      const skip = (page - 1) * limit;
      return this.prisma.role.findMany({
        skip: skip,
        take: limit,
      });
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  public async txUpdateAvatarById(
    id: number,
    avatarURL: string | null,
    tx: Prisma.TransactionClient,
  ): Promise<Role> {
    return tx.role.update({
      where: {
        id,
      },
      data: {
        avatarURL,
      },
    });
  }

  //#REFACTORED - publicId должен идти первым
  public async updateOneByPublicId(
    publicId: string,
    data: UpdateRole,
    avatarURL: string | null,
  ): Promise<Role> {
    try {
      return this.prisma.role.update({
        where: {
          publicId,
        },
        data: {
          ...data,
          avatarURL,
        },
      });
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  public async txCreateOne(name: string, tx: Prisma.TransactionClient): Promise<Role> {
    try {
      return tx.role.create({ data: { name } });
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  public async txDeleteOneByPublicId(publicId: string, tx: Prisma.TransactionClient) {
    return tx.role.delete({ where: { publicId } });
  }
}
