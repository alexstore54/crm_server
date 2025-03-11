import { Role } from '@prisma/client';
import { permissionsTableSchema } from '@/shared/schemas';

export const getModeratorSeedRole = (): Role => {
  return {
    name: 'Moderator',
    id: 0,
  };
};

export const noAccessAgentSeedRole = (): Role => {
  return {
    name: 'No access',
    id: 1,
  };
}

export const lowAccessAgentSeedRole = (): Role => {
  return {
    name: 'Minimum access',
    id: 2,
  };
}

export const getPermissions = (): string[] => {
  return Object.keys(permissionsTableSchema.describe().keys);
};


export const lowAccessPermissions = (): string[] => {
    return [
           "READ_TEAM_AGENTS" ,
           "CREATE_TEAM_AGENTS" ,
           "UPDATE_TEAM_AGENTS" ,
           "READ_LEADS",
           "CREATE_LEADS",
           "UPDATE_LEADS",
           "DELETE_LEADS",
           "READ_DESKS",
           "DELETE_DESKS" ,
           "READ_TEAMS" ,
           "UPDATE_HIMSELF" ,
    ]
}