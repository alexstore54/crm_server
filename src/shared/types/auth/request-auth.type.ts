import { Request } from 'express';
import { AgentAuthPayload, CustomerAuthPayload } from '@/shared/types/auth/auth-payload.type';
import { PermissionsKeys } from '@/shared/types/auth/permissions.type';

export interface RequestWithCustomerPayload extends Request {
  user: CustomerAuthPayload;
}

export interface RequestWithAgentPayload extends Request {
  user: AgentAuthPayload;
  permissions?: PermissionsKeys[];
}
