import {
  FullPermission,
  PermissionsKeys,
  PermissionsTable,
  PrismaPermissionWithDetails,
} from '@/shared/types/permissions';
import { Permission } from '@prisma/client';

export class PermissionsUtil {
  public static mapPrismaPermissionsToPermissionTable(
    prismaPermissions: PrismaPermissionWithDetails[],
  ): PermissionsTable {
    const permissionsTable: PermissionsTable = {};
    prismaPermissions.forEach((permission) => {
      permissionsTable[permission.Permission.key as PermissionsKeys] = {
        allowed: permission.allowed,
        id: permission.Permission.id,
      };
    });

    return permissionsTable;
  }

  public static mapPermissionsToFullPermissions(
    permissions: Permission[],
    roleId: number,
    allAllowed: boolean,
  ): FullPermission[] {
    return permissions.map((permission) => {
      return {
        roleId,
        permissionId: permission.id,
        allowed: allAllowed,
      };
    });
  }

  public static filterPermissionsDetail(permissions: FullPermission[]): FullPermission[] {
    return permissions.filter((permission) => permission.allowed);
  }
}
