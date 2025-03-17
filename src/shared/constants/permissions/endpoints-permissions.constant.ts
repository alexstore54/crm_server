import {
  CREATE_AGENTS_PERMISSIONS,
  READ_AGENTS_PERMISSIONS,
  UPDATE_AGENTS_PERMISSIONS,
} from '@/shared/constants/permissions';
import { PermissionsKeys } from '@/shared/types/permissions';

export const ENDPOINTS_PERMISSIONS = {
  AGENTS: {
    GET_AGENT_LEADS: [...READ_AGENTS_PERMISSIONS, PermissionsKeys.READ_ALL_LEADS],
    CREATE_AGENT: [...CREATE_AGENTS_PERMISSIONS, PermissionsKeys.CREATE_ALL_LEADS],
    UPDATE_AGENT: [...UPDATE_AGENTS_PERMISSIONS, PermissionsKeys.UPDATE_ALL_AGENTS],
  },
  CURRENT_AGENT: {
    UPDATE_ME: [PermissionsKeys.UPDATE_HIMSELF],
  },
  AGENT_PERMISSIONS: {
    UPDATE_AGENTS_PERMISSIONS: [PermissionsKeys.UPDATE_ALL_AGENTS_PERMISSIONS],
    GET_AGENTS_PERMISSIONS: [PermissionsKeys.READ_ALL_AGENTS],
  },
  ROLE_PERMISSIONS: {
    UPDATE_ROLES_PERMISSIONS: [PermissionsKeys.UPDATE_ALL_AGENTS_PERMISSIONS],
  },
  TEAMS: {
    CREATE_TEAM: [PermissionsKeys.CREATE_TEAMS],
    UPDATE_TEAM: [PermissionsKeys.UPDATE_TEAMS, PermissionsKeys.UPDATE_DESK_TEAMS],
    DELETE_TEAM: [PermissionsKeys.DELETE_TEAMS],
    GET_TEAM: [PermissionsKeys.READ_TEAMS, PermissionsKeys.READ_DESK_TEAMS],
    GET_ALL_TEAMS: [PermissionsKeys.READ_TEAMS, PermissionsKeys.READ_DESK_TEAMS],
  },
  AGENTS_SESSIONS: {
    GET_AGENT_SESSIONS: [PermissionsKeys.READ_ALL_AGENTS_SESSIONS],
    DELETE_AGENT_ALL_SESSIONS: [PermissionsKeys.DELETE_ALL_AGENTS_SESSIONS],
    DELETE_AGENT_SESSION: [PermissionsKeys.DELETE_ALL_AGENTS_SESSIONS],
  },
  DESKS: {
    GET_DESK_TEAMS: [PermissionsKeys.READ_DESK_TEAMS, PermissionsKeys.READ_TEAMS],
    GET_DESK: [PermissionsKeys.READ_DESKS],
    CREATE_DESK: [PermissionsKeys.CREATE_DESKS],
    UPDATE_DESK: [PermissionsKeys.UPDATE_DESKS],
    DELETE_DESK: [PermissionsKeys.DELETE_DESKS],
    GET_ALL_DESKS:[PermissionsKeys.READ_DESKS],
  },
  CUSTOMERS_SESSIONS: {},
  LOGS: {
    READ_LOGS: [PermissionsKeys.READ_LOGS],
  },
};
