import { Role } from '@prisma/client';
import { permissionsTableSchema } from '@/shared/schemas';

interface PartialRole extends Omit<Role, 'publicId'> {
  publicId?: string;
} // Иначе TS ругается на обязательное наличие publicId

export const getModeratorSeedRole = (): PartialRole => {
  return {
    name: 'Moderator',
    id: 0,
  };
};

export const getNoAccessAgentSeedRole = (): PartialRole => {
  return {
    name: 'No access',
    id: 1,
  };
}

export const getLowAccessAgentSeedRole = (): PartialRole => {
  return {
    name: 'Minimum access',
    id: 2,
  };
}

export const getPermissions = (): string[] => {
  return Object.keys(permissionsTableSchema.describe().keys);
};


export const lowAccessPermissions = ():string[] => {
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
           "UPDATE_HIMSELF",
    ]
}


