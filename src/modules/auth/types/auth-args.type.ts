import { Socket } from 'socket.io';
import { Agent, AgentPermission } from '@prisma/client';
import { FullCustomer } from '@/shared/types/user';
import { PayloadUUID } from '@/shared/types/redis';

export interface ConnectSocketArgs {
  client: Socket;
  payloadUUID: PayloadUUID;
}

export interface AuthenticateAgentArgs {
  agent: Agent;
  fingerprint: string;
  userAgent: string;
  permissions: AgentPermission[];
  deskPublicId: string;
  teamPublicId?: string;
}

export interface AuthenticateCustomerArgs {
  customer: FullCustomer;
  fingerprint: string;
  userAgent: string;
}

export interface MakeSessionArgs {
  userId: string;
  fingerprint: string;
  userAgent: string;
  isOnline: boolean;
  payloadUUID: PayloadUUID;
  refreshToken: string;
}
