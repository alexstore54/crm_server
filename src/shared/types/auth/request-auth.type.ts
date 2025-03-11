import { Request } from 'express';
import { CustomerAuthPayload, AgentAuthPayload } from '@/shared/types/auth/auth-payload.type';
import { PermissionOperation } from '@/shared/types/validation';
import { PermissionsKeys } from '@/shared/types/permissions';

export interface RequestWithCustomerPayload extends Request {
  user: CustomerAuthPayload;
}

export interface RequestWithAgentPayload extends Request {
  user: AgentAuthPayload;
  permissions?: PermissionsKeys[];
  operation?: PermissionOperation;
}
