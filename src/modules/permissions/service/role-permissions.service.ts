import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { RolePermissionRepository } from '@/modules/permissions/repositories';
import { IncomingPermission } from '@/modules/permissions/dto';
import { PermissionsTable, PrismaPermissionWithDetails } from '@/shared/types/permissions';
import { RoleRepository } from '@/modules/role/repositories/role.repository';
import { PrismaClient, Role, RolePermission } from '@prisma/client';
import { PermissionsUtil } from '@/shared/utils';
import { CreatRolePermissions } from '@/modules/permissions/dto/role-permissions';
import { PermissionsService } from '@/modules/permissions/service/permissions.service';
import { ERROR_MESSAGES } from '@/shared/constants/errors';

@Injectable()
export class RolePermissionsService {
  constructor(
    private readonly rolePermissionsRepository: RolePermissionRepository,
    private readonly permissionsService: PermissionsService,
    private readonly roleRepository: RoleRepository,
    private readonly prisma: PrismaClient,
  ) {}

  public async updateRolePermissions(
    rolePublicId: string,
    permissions: IncomingPermission[],
  ): Promise<PermissionsTable> {
    try {
      const result = this.prisma.$transaction(async (tx) => {
        const isPermissionsValid = await this.permissionsService.txIsPermissionsValid(permissions, tx);
        if (!isPermissionsValid) {
          throw new BadRequestException(ERROR_MESSAGES.INVALID_PERMISSIONS);
        }

        const role: Role | null = await this.roleRepository.txFindOneByPublicId(rolePublicId, tx);

        if (!role) {
          throw new NotFoundException();
        }

        const updatedPermissions: PrismaPermissionWithDetails[] =
          await this.rolePermissionsRepository.updateManyByRoleId(role.id, permissions, tx);

      })
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
    //TODO: Implement socket logic

    return PermissionsUtil.mapPrismaPermissionsToPermissionTable(updatedPermissions);
  }

  public async txCreateMany(data: CreatRolePermissions, tx: Prisma.TransactionClient): Promise<RolePermission[]> {
    const { permissions, roleId } = data;
    const isPermissionsValid = await this.permissionsService.isPermissionsValid(permissions);
    if (!isPermissionsValid) {
      throw new BadRequestException(ERROR_MESSAGES.INVALID_PERMISSIONS);
    }

    return this.rolePermissionsRepository.createMany(data);
  }

  public async deepUpdateRolePermissions(
    rolePublicId: string,
    permissions: IncomingPermission[],
  ): Promise<PermissionsTable> {
    const isPermissionsValid = await this.permissionsService.txIsPermissionsValid(permissions);
    if (!isPermissionsValid) {
      throw new BadRequestException(ERROR_MESSAGES.INVALID_PERMISSIONS);
    }

    const role: Role | null = await this.roleRepository.findOneByPublicId(rolePublicId);

    if (!role) {
      throw new NotFoundException();
    }

    const updatedPermissions: PrismaPermissionWithDetails[] =
      await this.rolePermissionsRepository.deepUpdateByRoleId(role.id, permissions);

    //TODO: Implement socket logic

    return PermissionsUtil.mapPrismaPermissionsToPermissionTable(updatedPermissions);
  }
}
