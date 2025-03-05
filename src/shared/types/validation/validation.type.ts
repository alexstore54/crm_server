import { AgentAuthPayload, PermissionsKeys } from '@/shared/types/auth';

export type PermissionOperation = 'create' | 'update' | 'delete' | 'read';

export enum GeneralConnects {
  TEAM = 'team',
  DESK = 'desk',
}

export enum UserEntityType {
  AGENT = 'agent',
  LEAD = 'lead',
  CUSTOMER = 'customer',
}

export interface AgentPermissionValidation {
  operation: PermissionOperation;
  permissions: PermissionsKeys[];
  currentAgentPayload: AgentAuthPayload;
  agentId: string;
}

export interface LeadPermissionValidation {
  operation: PermissionOperation;
  permissions: PermissionsKeys[];
  currentAgentPayload: AgentAuthPayload;
  leadPublicId: string;
}
