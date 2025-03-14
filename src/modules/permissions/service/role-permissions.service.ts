import { Injectable, NotFoundException } from '@nestjs/common';
import { RolePermissionRepository } from '@/modules/permissions/repositories';
import { IncomingPermission } from '@/modules/permissions/dto';
import { PermissionsTable, PrismaPermissionWithDetails } from '@/shared/types/permissions';
import { RoleRepository } from '@/modules/role/repositories/role.repository';
import { Role } from '@prisma/client';
import { PermissionsUtil } from '@/shared/utils';

@Injectable()
export class RolePermissionsService {
  constructor(
    private readonly rolePermissionsRepository: RolePermissionRepository,
    private readonly roleRepository: RoleRepository,
  ) {}

  public async updateRolePermissions(
    rolePublicId: string,
    permissions: IncomingPermission[],
  ): Promise<PermissionsTable> {
    const role: Role | null = await this.roleRepository.findOneByPublicId(rolePublicId);

    if (!role) {
      throw new NotFoundException();
    }

    const updatedPermissions: PrismaPermissionWithDetails[] =
      await this.rolePermissionsRepository.updateManyByRoleId(role.id, permissions);

    //TODO: Implement socket logic

    return PermissionsUtil.mapPrismaPermissionsToPermissionTable(updatedPermissions);
  }

  public async deepUpdateRolePermissions(
    rolePublicId: string,
    permissions: IncomingPermission[],
  ): Promise<PermissionsTable> {
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
