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
