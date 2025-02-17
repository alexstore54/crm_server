import { Socket } from 'socket.io';
import { SessionId } from '@/shared/types/auth';


export interface ConnectSocketArgs {
  client: Socket;
  sessionId: SessionId;
}

export interface MakeSessionArgs {
  user: any;
  fingerprint: string;
  userAgent: string;
  refreshToken: string;
}
