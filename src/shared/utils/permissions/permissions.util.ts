import {
  PermissionDetail,
  PermissionsKeys,
  PermissionsTable,
  PrismaPermissionWithDetails,
} from '@/shared/types/permissions';

export class PermissionsUtil {
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

  public static filterPermissionsDetail(permissions: PermissionDetail[]): PermissionDetail[] {
    return permissions.filter((permission) => permission.allowed);
  }
}
