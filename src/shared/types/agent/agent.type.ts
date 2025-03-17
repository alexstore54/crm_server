import { Agent, Desk, Team } from '@prisma/client';
import { PermissionsTable } from '@/shared/types/permissions';

export type FullAgent = {
  agent: AgentForClient;
  teams: Team[];
  desks: Desk[];
  permissions: PermissionsTable;
};

export type AgentForClient = Omit<Agent, 'password'>;
