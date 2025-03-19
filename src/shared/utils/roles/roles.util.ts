import { Role, RolePermission } from "@prisma/client";

export class RolesUtil {
    public static mapRolesWithRolePermissions(
        roles: (Role & { RolePermission: RolePermission[] })[]
    ){
        return roles.map(role => ({
            role: {
                publicId: role.publicId,
                name: role.name
            },
            permissions: role.RolePermission.map(permission => ({
                        roleId: permission.roleId,
                        permissionId: permission.permissionId,
                        allowed: permission.allowed
            }))
        }));
    }
}