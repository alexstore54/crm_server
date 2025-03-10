import { PermissionsTable } from '@/shared/types/permissions';
import { IncomingPermission } from '@/modules/permissions/dto/agent-permissions';
import { AllowedPermission } from '@/modules/permissions/types';
import { AgentPermission, RolePermission } from '@prisma/client';

//утилита для работы с входящими permissions
export class IncomingPermissionsUtil {
  public static filterUniquePermissions(permissions: IncomingPermission[]): IncomingPermission[] {
    const permissionMap = new Map<number, boolean>();

    for (const permission of permissions) {
      permissionMap.set(permission.permissionId, permission.allowed);
    }

    return Array.from(permissionMap, ([permissionId, allowed]) => ({
      permissionId,
      allowed,
    }));
  }

  public static filterPermissionsByRoleDefaults(
    uniquePermissions: IncomingPermission[],
    rolePermissions: IncomingPermission[],
    agentId: number,
  ): AllowedPermission[] {
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
    }, [] as AllowedPermission[]);
  }

  public static mapPermissionsToAgentPermissions(
    agentId: number,
    rolePermissions: RolePermission[],
    incomingPermissions: IncomingPermission[],
  ): AgentPermission[] {
    const rolePermissionIds = new Set(
      rolePermissions.map((rolePermission) => rolePermission.permissionId),
    );

    return incomingPermissions
      .filter((perm) => rolePermissionIds.has(perm.permissionId))
      .map((perm) => {
        const rolePerm = rolePermissions.find((rp) => rp.permissionId === perm.permissionId);
        return rolePerm && rolePerm.allowed !== perm.allowed
          ? { ...perm, allowed: perm.allowed, agentId }
          : undefined;
      })
      .filter((item): item is AgentPermission => item !== undefined);
  }

  // private static createRolesMap(
  //   defaultRoles: RolePermissionWithDetails[],
  // ): Map<number, { allowed: boolean; key: string }> {
  //   const rolesMap = new Map<number, { allowed: boolean; key: string }>();
  //   for (const rolePermission of defaultRoles) {
  //     rolesMap.set(rolePermission.permissionId, {
  //       allowed: rolePermission.allowed,
  //       key: rolePermission.Permission.key,
  //     });
  //   }
  //   return rolesMap;
  // }
  //
  // private static updateRolesMapWithAgentPermissions(
  //   rolesMap: Map<number, { allowed: boolean; key: string }>,
  //   agentRoles: AllowedPermission[],
  // ): void {
  //   for (const agentPermission of agentRoles) {
  //     if (rolesMap.has(agentPermission.permissionId)) {
  //       const current = rolesMap.get(agentPermission.permissionId);
  //       if (current) {
  //         current.allowed = agentPermission.allowed;
  //         rolesMap.set(agentPermission.permissionId, current);
  //       }
  //     }
  //   }
  // }
  //
  // private static convertRolesMapToPermissionsTable(
  //   rolesMap: Map<number, { allowed: boolean; key: string }>,
  // ): PermissionsTable {
  //   const result = {} as PermissionsTable;
  //   for (const [, { allowed, key }] of rolesMap.entries()) {
  //     if (allowed) {
  //       (result as { [key: string]: boolean })[key] = true;
  //     }
  //   }
  //   return result;
  // }

  // public static convertRolePermissionsToPermissionsTable(
  //   rolePermissions: RolePermissionWithDetails[],
  // ): PermissionsTable {
  //   const result = {} as PermissionsTable;
  //   rolePermissions
  //     .filter((perm) => perm.allowed)
  //     .forEach((p) => {
  //       (result as { [key: string]: boolean })[p.Permission.key] = true;
  //     });
  //   return result;
  // }
  //
  // public static mergePermissions(
  //   defaultRoles: RolePermissionWithDetails[],
  //   agentRoles: AllowedPermission[],
  // ): PermissionsTable {
  //   const rolesMap = this.createRolesMap(defaultRoles);
  //   this.updateRolesMapWithAgentPermissions(rolesMap, agentRoles);
  //   return this.convertRolesMapToPermissionsTable(rolesMap);
  // }
}
