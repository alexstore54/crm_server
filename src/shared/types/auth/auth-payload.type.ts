import { SessionUUID } from '@/shared/types/auth/session.type';
import { RouteAccess } from '@prisma/client';

export type AgentAuthPayload = {
  descId?: string;
  routeAccess: RouteAccess;
  sessionUUID: SessionUUID;
  sub: string;
};

export type CustomerAuthPayload = {
  sessionUUID: SessionUUID;
  sub: string;
};
