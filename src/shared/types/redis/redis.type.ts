import { PermissionsTable } from '@/shared/types/permissions';

export type PayloadUUID = string;
export type PayloadId = string;

export interface SaveAgentInput {
  agentPublicId: string;
  payloadUUID: PayloadUUID;
  sessionInput: CreateSessionInput;
  permissionsInput: CreatePermissionsInput;
}

export interface SaveCustomerInput {
  customerPublicId: string;
  payloadUUID: PayloadUUID;
  sessionInput: CreateSessionInput;
}

export interface CreatePermissionsInput {
  permissions: PermissionsTable;
}

export interface UpdatePermissionsInput {
  permissions: PermissionsTable;
}

export interface CreateSessionInput {
  fingerprint: string;
  userAgent: string;
  isOnline: boolean;
  payloadUUID: PayloadUUID;
  hashedRefreshToken?: string;
}

export interface UpdateSessionInput {
  refreshToken?: string;
  fingerprint?: string;
  userAgent?: string;
  isOnline?: boolean;
}
