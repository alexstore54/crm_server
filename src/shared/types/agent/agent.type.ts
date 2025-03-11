import { Agent, Desk, Team } from '@prisma/client';
import { PermissionsTable } from '@/shared/types/permissions';

export type FullAgent = {
  agent: Agent;
  teams: Team[];
  desks: Desk[];
  permissions: PermissionsTable;
};
