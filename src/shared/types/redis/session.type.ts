import { PayloadUUID } from '@/shared/types/redis/redis.type';

export type SessionId = string;

export type Session = {
  userId: string;
  // role: string;
  payloadUUID: PayloadUUID;
  hashedRefreshToken: string;
  fingerprint: string;
  userAgent: string;
  isOnline: boolean;
};

export interface CreateSessionInput {
  userId: string;
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
