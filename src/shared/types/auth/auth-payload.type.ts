import { PayloadUUID } from '@/shared/types/redis';

export type AgentAuthPayload = {
  teamPublicId?: string;
  deskPublicId: string;
  payloadUUID: PayloadUUID;
  sub: string;
};

export type CustomerAuthPayload = {
  payloadUUID: PayloadUUID;
  sub: string;
};
