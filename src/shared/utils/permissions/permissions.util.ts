import { IncomingPermission } from '@/modules/permissions/dto';
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

  public static mapAndFilterPermissionsToRolePermissions(
      DBpermissions: Permission[],
      roleId: number,
      incomingPermissions: IncomingPermission[]
  ){
    return DBpermissions.map(db_perm => {
      const incomePermisson = incomingPermissions.find(in_perm => in_perm.permissionId === db_perm.id);
      if(incomePermisson){
          return {
              roleId,
              permissionId: incomePermisson.permissionId,
              allowed: incomePermisson.allowed
          }
      }
      return null;
    }).filter(item => item !== null);
  }

  public static filterPermissionsDetail(permissions: FullPermission[]): FullPermission[] {
      return permissions.filter(perm => perm.allowed);
  }
}
