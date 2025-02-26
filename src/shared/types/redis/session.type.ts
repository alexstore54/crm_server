import { PayloadUUID } from '@/shared/types/redis/redis.type';

export enum SessionRoles {
  agent = 'AGENT',
  customer = 'CUSTOMER',
}

export type Session = {
  userId: string;
  payloadUUID: PayloadUUID;
  hashedRefreshToken: string;
  fingerprint: string;
  userAgent: string;
  isOnline: boolean;
  role: SessionRoles;
};

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
