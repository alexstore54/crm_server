import { Expose, Type } from 'class-transformer';

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

export class SingleRoleResponse {
  @Expose()
  @Type(() => RoleResponse)
  role: RoleResponse;
}

export class RolePermissionResponse {
  @Expose()
  key: string;

  @Expose()
  id: number;

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