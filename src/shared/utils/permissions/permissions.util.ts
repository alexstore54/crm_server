import { AgentPermission, RolePermission } from '@prisma/client';
import { IncomingPermission } from '@/modules/permissions/dto/agent-permissions';
import { Permissions } from '@/shared/types/redis';
import { PermissionsKeys } from '@/shared/types/auth';

export class PermissionsUtil {
  public static mapPermissionsToAgentPermissions(
    agentId: number,
    rolePermissions: RolePermission[],
    agentPermissions: IncomingPermission[],
  ): AgentPermission[] {
    const rolePermissionIds = new Set(rolePermissions.map((rp) => rp.permissionId));

    return agentPermissions
      .filter((perm) => rolePermissionIds.has(perm.permissionId))
      .map((perm) => {
        const rolePerm = rolePermissions.find((rp) => rp.permissionId === perm.permissionId);
        if (!rolePerm || rolePerm.allowed === perm.allowed) {
          return undefined;
        }
        return { ...perm, allowed: perm.allowed, agentId };
      })
      .filter((item) => item !== undefined);
  }

  public static mapAgentPermissionsToPayload(permissions: AgentPermission[]): Permissions {
    // return permissions.reduce((acc, perm) => {
    //   acc[perm.permissionId] = perm.allowed;
    //   return acc;
    // }, {} as Permissions);
    return {
      [PermissionsKeys.CREATE_DESK_AGENTS]: true,
    };
  }
}
