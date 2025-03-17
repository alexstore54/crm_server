import { permissionsTableSchema } from '@/shared/schemas';
import { PermissionsKeys } from '@/shared/types/permissions';

export const getModeratorSeedRole = () => {
  return {
    name: 'Moderator',
    isVisible: false,
    isMutable: false,
  };
};

export const getNoAccessAgentSeedRole = () => {
  return {
    name: 'No access',
  };
};

export const getLowAccessAgentSeedRole = () => {
  return {
    name: 'Minimum access',
  };
};

export const getPermissions = (): string[] => {
  return Object.keys(permissionsTableSchema.describe().keys);
};

export const lowAccessPermissions = (): PermissionsKeys[] => {
  return [
    PermissionsKeys.READ_TEAM_AGENTS,
    PermissionsKeys.READ_TEAM_LEADS,
    PermissionsKeys.READ_DESKS,
    PermissionsKeys.READ_TEAMS,
    PermissionsKeys.UPDATE_HIMSELF,
  ];
};
