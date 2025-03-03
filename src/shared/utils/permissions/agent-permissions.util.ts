import { AgentPermission } from '@/modules/permissions/types';
import { Permission, RolePermission as PrismaRolePermission } from '@prisma/client';
import { PermissionsTable } from '@/shared/types/redis';

export type RolePermissionWithDetails = PrismaRolePermission & {
  Permission: Permission;
};

export class AgentPermissionsUtil {
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
    agentRoles: AgentPermission[],
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
    rolePermissions: RolePermissionWithDetails[]
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
    agentRoles: AgentPermission[],
  ): PermissionsTable {
    const rolesMap = this.createRolesMap(defaultRoles);
    this.updateRolesMapWithAgentPermissions(rolesMap, agentRoles);
    return this.convertRolesMapToPermissionsTable(rolesMap);
  }
}