import { AgentAuthPayload, PermissionsKeys } from '@/shared/types/auth';

export type ValidationOperation = 'create' | 'update' | 'delete' | 'read';

export enum GeneralConnects {
  TEAM = 'team',
  DESK = 'desk',
}

export interface AgentPermissionValidation {
  operation: ValidationOperation;
  permissions: PermissionsKeys[];
  currentAgentPayload: AgentAuthPayload;
  agentId: string;
}

export interface LeadPermissionValidation {
  operation: ValidationOperation;
  permissions: PermissionsKeys[];
  currentAgentPayload: AgentAuthPayload;
  leadPublicId: string;
}