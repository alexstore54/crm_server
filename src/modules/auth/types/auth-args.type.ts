import { Socket } from 'socket.io';
import { Agent } from '@prisma/client';
import { FullLead } from 'shared/types/user';
import { PayloadUUID } from '@/shared/types/redis';
import { PermissionsTable } from '@/shared/types/permissions';

export interface ConnectSocketArgs {
  client: Socket;
  payloadUUID: PayloadUUID;
}

export interface AuthenticateAgentArgs {
  agent: Agent;
  fingerprint: string;
  userAgent: string;
  permissions: PermissionsTable;
  desksPublicId: string[];
  teamsPublicId: string[];
}

export interface AuthenticateCustomerArgs {
  customer: FullLead;
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
