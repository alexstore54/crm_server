import { RouteAccess } from '@prisma/client';
import { PayloadUUID } from '@/shared/types/redis';

export type AgentAuthPayload = {
  descId?: string;
  payloadUUID: PayloadUUID;
  sub: string;
};

export type CustomerAuthPayload = {
  payloadUUID: PayloadUUID;
  sub: string;
};
