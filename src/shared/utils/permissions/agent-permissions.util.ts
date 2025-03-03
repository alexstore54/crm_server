import { AgentPermission } from '@/modules/permissions/types';
import { RolePermission as PrismaRolePermission, Permission } from '@prisma/client';

export type RolePermissionWithPermission = PrismaRolePermission & {
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
  ): AgentPermission[] {
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
    }, [] as AgentPermission[]);
  }

  public static mergePermissions(defaultRoles: RolePermissionWithPermission[], agentRoles: AgentPermission[]): string[] {
    // 1. Создаём карту: permissionId -> { allowed, key }
    const rolesMap = new Map<number, { allowed: boolean; key: string }>();
    
    // Заполняем из RolePermissions
    for (const rolePermission of defaultRoles) {
      rolesMap.set(rolePermission.permissionId, {
          allowed: rolePermission.allowed,
          key: rolePermission.Permission.key, // берем key из вложенного Permission
      });
    }

    // 2. Перезаписываем значениями из AgentPermissions
    for (const agentPermission of agentRoles) {
      // Если какой-то permissionId есть у агента, обновляем "allowed"
      if (rolesMap.has(agentPermission.permissionId)) {
        const current = rolesMap.get(agentPermission.permissionId);
          if (current) {
              current.allowed = agentPermission.allowed;
              rolesMap.set(agentPermission.permissionId, current);
          }
      }
    }

    
    const result: string[] = [];
    for (const [, { allowed, key }] of rolesMap.entries()) {
      if (allowed) {
          result.push(key);
      }
    }

    return result;
  }
}
