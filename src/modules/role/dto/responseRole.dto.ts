import { Expose, Type } from "class-transformer";

export class RoleResponse {
    @Expose()
    publicId: string;

    @Expose()
    name: string;
}

export class RolesResponse {
    @Expose()
    @Type(() => RoleResponse)
    roles: RoleResponse[];
}


export class RolePermissionResponse {
    @Expose()
    roleId: number;

    @Expose()
    permissionId: number;

    @Expose()
    allowed: boolean;
}

export class RoleAndPermissionsResponse {
    @Expose()
    role: RoleResponse;

    @Expose()
    @Type(() => RolePermissionResponse)
    permissions: RolePermissionResponse[];
}