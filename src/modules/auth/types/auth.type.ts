import { Agent } from '@prisma/client';
import { Permissions } from '@/shared/types/redis';

export type AuthAgentLoginInput = {
  agent: Agent;
  permissions: Permissions[];
  deskPublicId: string;
  teamPublicId?: string;
};
