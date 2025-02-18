import { Socket } from 'socket.io';
import { SessionUUID } from '@/shared/types/auth';
import { Agent } from '@prisma/client';
import { Customer } from '@/shared/types/user';

export interface ConnectSocketArgs {
  client: Socket;
  sessionUUID: SessionUUID;
}

export type UserType = 'agent' | 'customer';

export interface AuthenticateArgs {
  // socketClient: Socket;
  user: Agent | Customer;
  fingerprint: string;
  userAgent: string;
}

export interface MakeSessionArgs {
  userId: string;
  fingerprint: string;
  userAgent: string;
  isOnline: boolean;
  sessionUUID: SessionUUID;
  refreshToken: string;
}
