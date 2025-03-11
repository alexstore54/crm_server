import {
  PermissionDetail,
  PermissionsKeys,
  PermissionsTable,
  PrismaPermissionWithDetails,
} from '@/shared/types/permissions';

export class PermissionsUtil {
  public static mapPermissionDetailToPermissionTable(
    mergedPermissions: PermissionDetail[],
  ): PermissionsTable {
    const permissionsTable: PermissionsTable = {};

    for (const mergedPermission of mergedPermissions) {
      if (mergedPermission.allowed) {
        permissionsTable[mergedPermission.key] = mergedPermission.allowed;
      }
    }

    return permissionsTable;
  }

  public static mapPrismaPermissionToPermissionDetail(
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


  public static mergePermissions(
    agentPermissions: PermissionDetail[],
    rolePermissions: PermissionDetail[],
  ): PermissionDetail[] {
    const mergedPermissionsMap: { [key: string]: PermissionDetail } = {};

    for (const rolePermission of rolePermissions) {
      mergedPermissionsMap[rolePermission.key] = rolePermission;
    }

    for (const agentPermission of agentPermissions) {
      mergedPermissionsMap[agentPermission.key] = agentPermission;
    }

    return Object.values(mergedPermissionsMap);
  }

  public static filterPermissionsDetail(permissions: PermissionDetail[]): PermissionDetail[] {
    return permissions.filter((permission) => permission.allowed);
  }
}
