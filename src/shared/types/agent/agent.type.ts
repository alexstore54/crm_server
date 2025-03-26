import { Agent, Desk, Team } from '@prisma/client';
import { PermissionsTable } from '@/shared/types/permissions';
import { RoleForClient } from '@/shared/types/roles';

export type FullAgent = {
  agent: AgentForClient;
  teams: Team[];
  desks: Desk[];
  permissions: PermissionsTable;
  role: RoleForClient;
};

export type AgentForClient = Omit<Agent, 'password'>;
