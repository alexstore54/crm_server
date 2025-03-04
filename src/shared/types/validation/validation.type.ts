import { PermissionsKeys } from '@/shared/types/auth';

export type ValidationOperationType = 'create' | 'update' | 'delete' | 'read';

export enum GeneralEntities {
  TEAM = 'team',
  DESK = 'desk',
}

export interface AgentValidationArgs {
  operation: ValidationOperationType;
  permissions: PermissionsKeys[];
  currentAgentId: string;
  agentId: string;
}