import { Socket } from 'socket.io';
import { SessionId, SessionUUID } from '@/shared/types/auth';


export interface ConnectSocketArgs {
  client: Socket;
  sessionId: SessionId;
}

export type UserType = 'agent' | 'customer';

export interface AuthenticateArgs {
  // socketClient: Socket;
  user: any;
  fingerprint: string;
  userAgent: string;
}

export interface MakeSessionArgs {
  userId: string;
  fingerprint: string;
  userAgent: string;
  isOnline: boolean;
  sessionUUID: SessionUUID,
  refreshToken: string;
}
