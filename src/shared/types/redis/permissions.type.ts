import { AgentAuthPayload, PermissionsKeys } from '@/shared/types/auth';

export type Permissions = {
  [key in PermissionsKeys]?: boolean;
};

export interface CreatePermissionsInput {
  permissions: Permissions;
}
export interface UpdatePermissionsInput {
  permissions: Permissions;
}

export interface ValidatePermissionsArgs {
  agentPayload: AgentAuthPayload;
  checkedPublicId: string;
}
