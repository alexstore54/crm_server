import { AgentAuthPayload, PermissionsKeys } from '@/shared/types/auth';

export type PermissionsTable = {
  [key in PermissionsKeys]?: boolean;
};

export interface CreatePermissionsInput {
  permissions: PermissionsTable;
}
export interface UpdatePermissionsInput {
  permissions: PermissionsTable;
}

