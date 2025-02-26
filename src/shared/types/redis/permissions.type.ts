export type PermissionsId = string;

export type Permissions  = {
  read: boolean;
  write: boolean;
  delete: boolean;
}

export interface CreatePermissionsInput {
  permissions: Permissions;
}
export interface UpdatePermissionsInput {
  permissions: Permissions;
}