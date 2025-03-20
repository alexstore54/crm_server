import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '@/shared/db/prisma';
import { Prisma, Role } from '@prisma/client';
import { ERROR_MESSAGES } from '@/shared/constants/errors';
import { UpdateRole } from '../dto/createRole.dto';

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

  public async txfindOneByPublicId(publicId: string, tx: Prisma.TransactionClient): Promise<Role | null> {
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

  public async txFindOneById(id: number, tx: Prisma.TransactionClient){
      return tx.role.findFirst({where: {id}})
  }

  public async findOneByPublicIdWithPermissions(publicId: string){
    try{
        return this.prisma.role.findFirst({
                where: {
                  publicId: publicId
                },
                include: {
                  RolePermission: {
                    include: {
                      Permission: {
                        select: {
                            id: true,
                            key: true
                        }
                      }
                    }
                  }
                }
              })
    }catch(error: any){
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
  public async findManyWithRolePermissions(){
    try{
      return this.prisma.role.findMany({
          include: {
              RolePermission: {
                include: {
                  Permission: true
                }
              }
          }
      })
    }catch(error: any){
        throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  public async updateOneByPublicId(data: UpdateRole, publicId: string){
    try{
      return this.prisma.role.update({
        where: {
          publicId
        },
        data
      })
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

  public async txDeleteOneByPublicId(publicId: string, tx: Prisma.TransactionClient){
      return tx.role.delete({where: {publicId}})
  }

  
}
