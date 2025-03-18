import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '@/shared/db/prisma';
import { Prisma, Role } from '@prisma/client';
import { ERROR_MESSAGES } from '@/shared/constants/errors';

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

  public async findMany(): Promise<Role[]>{
    try {
      return this.prisma.role.findMany({})
    }catch(error: any){
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  public async txCreateOne(name: string, tx: Prisma.TransactionClient):Promise<Role>{
      try{
          return tx.role.create({data:{name}})
      }catch(error: any){
        throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
      }
  }
}
