import { SessionUUID } from '@/shared/types/auth/session.type';

export type AgentAuthPayload = {
  descId?: string;
  role: string;
  sessionUUID: SessionUUID;
  sub: string;
}

export type CustomerAuthPayload = {
  sessionUUID: SessionUUID;
  sub: string;
}
