import { Prisma, Role, RolePermission } from "@prisma/client";
import { PermissionsUtil } from "../permissions/permissions.util";

export class RolesUtil {
    public static mapRolesWithRolePermissions(
        roles: Prisma.RoleGetPayload<{
            include: {
              RolePermission: {
                include: {
                  Permission: true;
                };
              };
            };
          }
        >[]){
            
        return roles.map(role => ({
            role: {
                publicId: role.publicId,
                name: role.name,
            },
            permissions: PermissionsUtil.mapPrismaPermissionsToPermissionTable(role.RolePermission)
        }));
    }
}