import { PayloadUUID } from '@/shared/types/redis';

export type AgentAuthPayload = {
  teamsPublicId: string[] | null;
  desksPublicId: string[];
  payloadUUID: PayloadUUID;
  sub: string;
};

export type CustomerAuthPayload = {
  payloadUUID: PayloadUUID;
  sub: string;
};
