import { CreatePermissionsInput, CreateSessionInput } from '@/shared/types/redis';

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
