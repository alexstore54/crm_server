import { RouteAccess } from '@prisma/client';
import { PayloadUUID } from '@/shared/types/redis';

export type AgentAuthPayload = {
  deskIds?: number[];
  payloadUUID: PayloadUUID;
  sub: string;
};

export type CustomerAuthPayload = {
  payloadUUID: PayloadUUID;
  sub: string;
};
