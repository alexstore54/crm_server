import { PermissionsKeys } from '@/shared/types/permissions';

export const PERMISSION_CONFIG = {
  agent: {
    moderator: {
      create: PermissionsKeys.CREATE_AGENTS,
      update: PermissionsKeys.UPDATE_ALL_AGENTS,
      delete: PermissionsKeys.DELETE_ALL_AGENTS,
      read: PermissionsKeys.READ_ALL_AGENTS,
    },
    desk: {
      create: PermissionsKeys.CREATE_DESK_AGENTS,
      update: PermissionsKeys.UPDATE_DESK_AGENTS,
      delete: PermissionsKeys.DELETE_DESK_AGENTS,
      read: PermissionsKeys.READ_DESK_AGENTS,
    },
    team: {
      create: PermissionsKeys.CREATE_TEAM_AGENTS,
      update: PermissionsKeys.UPDATE_TEAM_AGENTS,
      delete: PermissionsKeys.DELETE_TEAM_AGENTS,
      read: PermissionsKeys.READ_TEAM_AGENTS,
    },
  },
  lead: {
    moderator: {
      create: PermissionsKeys.CREATE_ALL_LEADS,
      update: PermissionsKeys.UPDATE_ALL_LEADS,
      delete: PermissionsKeys.DELETE_ALL_LEADS,
      read: PermissionsKeys.READ_ALL_LEADS,
    },
    desk: {
      create: PermissionsKeys.CREATE_DESK_LEADS,
      update: PermissionsKeys.UPDATE_DESK_LEADS,
      delete: PermissionsKeys.DELETE_DESK_LEADS,
      read: PermissionsKeys.READ_DESK_LEADS,
    },
    team: {
      create: PermissionsKeys.CREATE_TEAM_LEADS,
      update: PermissionsKeys.UPDATE_TEAM_LEADS,
      delete: PermissionsKeys.DELETE_TEAM_LEADS,
      read: PermissionsKeys.READ_TEAM_LEADS,
    },
  },
  team: {
    moderator: {
      create: PermissionsKeys.CREATE_TEAMS,
      update: PermissionsKeys.UPDATE_TEAMS,
      delete: PermissionsKeys.DELETE_TEAMS,
      read: PermissionsKeys.READ_TEAM_LEADS,
    },
    desk: {
      update: PermissionsKeys.UPDATE_DESK_TEAMS,
      delete: PermissionsKeys.DELETE_DESK_LEADS,
      read: PermissionsKeys.READ_DESK_TEAMS,
      create: PermissionsKeys.CREATE_TEAM_LEADS,
    }
  }
};
