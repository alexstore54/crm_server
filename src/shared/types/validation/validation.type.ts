import { PermissionsKeys } from '@/shared/types/auth';

export type ValidationOperation = 'create' | 'update' | 'delete' | 'read';

export enum GeneralEntities {
  TEAM = 'team',
  DESK = 'desk',
}

export interface AgentPermissionValidation {
  operation: ValidationOperation;
  permissions: PermissionsKeys[];
  currentAgentId: string;
  agentId: string;
}