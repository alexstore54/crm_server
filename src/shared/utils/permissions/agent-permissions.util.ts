import { PermissionWithKey } from '@/modules/permissions/types';
import { Permission, RolePermission as PrismaRolePermission } from '@prisma/client';
import { PermissionsTable } from '@/shared/types/redis';

export type RolePermissionWithDetails = PrismaRolePermission & {
  Permission: Permission;
};

export class AgentPermissionsUtil {
  public static filterUniquePermissions(
    permissions: { permissionId: number; allowed: boolean }[],
  ): {
    permissionId: number;
    allowed: boolean;
  }[] {
    const uniquePermissions = new Map<number, boolean>();

    for (const perm of permissions) {
      uniquePermissions.set(perm.permissionId, perm.allowed);
    }

    return Array.from(uniquePermissions.entries()).map(([permissionId, allowed]) => ({
      permissionId,
      allowed,
    }));
  }

  public static filterPermissionsByRoleDefaults(
    uniquePermissions: { permissionId: number; allowed: boolean }[],
    rolePermissions: { permissionId: number; allowed: boolean }[],
    agentId: number,
  ): PermissionWithKey[] {
    return uniquePermissions.reduce((acc, incoming) => {
      const rolePerm = rolePermissions.find((rp) => rp.permissionId === incoming.permissionId);

      const defaultAllowed = rolePerm ? rolePerm.allowed : false;
      if (incoming.allowed !== defaultAllowed) {
        acc.push({
          agentId,
          permissionId: incoming.permissionId,
          allowed: incoming.allowed,
        });
      }
      return acc;
    }, [] as PermissionWithKey[]);
  }

  private static createRolesMap(
    defaultRoles: RolePermissionWithDetails[],
  ): Map<number, { allowed: boolean; key: string }> {
    const rolesMap = new Map<number, { allowed: boolean; key: string }>();
    for (const rolePermission of defaultRoles) {
      rolesMap.set(rolePermission.permissionId, {
        allowed: rolePermission.allowed,
        key: rolePermission.Permission.key,
      });
    }
    return rolesMap;
  }

  private static updateRolesMapWithAgentPermissions(
    rolesMap: Map<number, { allowed: boolean; key: string }>,
    agentRoles: PermissionWithKey[],
  ): void {
    for (const agentPermission of agentRoles) {
      if (rolesMap.has(agentPermission.permissionId)) {
        const current = rolesMap.get(agentPermission.permissionId);
        if (current) {
          current.allowed = agentPermission.allowed;
          rolesMap.set(agentPermission.permissionId, current);
        }
      }
    }
  }

  private static convertRolesMapToPermissionsTable(
    rolesMap: Map<number, { allowed: boolean; key: string }>,
  ): PermissionsTable {
    const result = {} as PermissionsTable;
    for (const [, { allowed, key }] of rolesMap.entries()) {
      if (allowed) {
        (result as { [key: string]: boolean })[key] = true;
      }
    }
    return result;
  }

  public static convertRolePermissionsToPermissionsTable(
    rolePermissions: RolePermissionWithDetails[],
  ): PermissionsTable {
    const result = {} as PermissionsTable;
    rolePermissions
      .filter((perm) => perm.allowed)
      .forEach((p) => {
        (result as { [key: string]: boolean })[p.Permission.key] = true;
      });
    return result;
  }

  public static mergePermissions(
    defaultRoles: RolePermissionWithDetails[],
    agentRoles: PermissionWithKey[],
  ): PermissionsTable {
    const rolesMap = this.createRolesMap(defaultRoles);
    this.updateRolesMapWithAgentPermissions(rolesMap, agentRoles);
    return this.convertRolesMapToPermissionsTable(rolesMap);
  }
}
