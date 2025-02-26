import { Socket } from 'socket.io';
import { Agent, AgentPermission } from '@prisma/client';
import { FullCustomer } from '@/shared/types/user';
import { PayloadUUID } from '@/shared/types/redis';

export interface ConnectSocketArgs {
  client: Socket;
  payloadUUID: PayloadUUID;
}

export type UserType = 'agent' | 'customer';

export interface AuthenticateArgs {
  user: Agent | FullCustomer;
  fingerprint: string;
  userAgent: string;
  permissions?: AgentPermission[]
}

export interface MakeSessionArgs {
  userId: string;
  fingerprint: string;
  userAgent: string;
  isOnline: boolean;
  payloadUUID: PayloadUUID;
  refreshToken: string;
}
