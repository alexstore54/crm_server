import { AgentPermission } from '@/modules/permissions/types';

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
}
