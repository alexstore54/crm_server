import {
  PermissionDetail,
  PermissionsKeys,
  PermissionsTable,
  PrismaPermissionWithDetails,
} from '@/shared/types/permissions';

export class PermissionsUtil {
  public static mapPermissionDetailToPermissionTable(
    permissionsDetail: PermissionDetail[],
  ): PermissionsTable {
    const permissionsTable: PermissionsTable = {};

    for (const permissionDetail of permissionsDetail) {
      permissionsTable[permissionDetail.key] = {
        allowed: permissionDetail.allowed,
        permissionId: permissionDetail.id,
      };
    }

    return permissionsTable;
  }

  public static mapPrismaPermissionsToPermissionTable(
    prismaPermissions: PrismaPermissionWithDetails[],
  ): PermissionsTable {
    const permissionsTable: PermissionsTable = {};
    prismaPermissions.forEach((permission) => {
      permissionsTable[permission.Permission.key as PermissionsKeys] = {
        allowed: permission.allowed,
        permissionId: permission.Permission.id,
      };
    });

    return permissionsTable;
  }

  public static mapPrismaPermissionsToPermissionDetail(
    permissions: PrismaPermissionWithDetails[],
  ): PermissionDetail[] {
    return permissions.map((permission) => {
      return {
        id: permission.Permission.id,
        key: permission.Permission.key as PermissionsKeys,
        allowed: permission.allowed,
      };
    });
  }

  public static filterPermissionsDetail(permissions: PermissionDetail[]): PermissionDetail[] {
    return permissions.filter((permission) => permission.allowed);
  }
}
