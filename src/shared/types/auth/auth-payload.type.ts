import { PayloadUUID } from '@/shared/types/redis';

export type AgentAuthPayload = {
  teamsPublicId: string[];
  desksPublicId: string[];
  payloadUUID: PayloadUUID;
  sub: string;
};

export type CustomerAuthPayload = {
  payloadUUID: PayloadUUID;
  sub: string;
};
