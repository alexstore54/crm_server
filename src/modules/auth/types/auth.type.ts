import { Agent } from '@prisma/client';
import { PermissionsTable } from '@/shared/types/permissions';

export type AuthAgentLoginInput = {
  agent: Agent;
  permissions: PermissionsTable;
  desksPublicId: string[];
  teamsPublicId: string[];
};
