import { PermissionsKeys } from '@/shared/types/permissions';

export const READ_AGENTS_PERMISSIONS: PermissionsKeys[] = [
  PermissionsKeys.READ_TEAM_AGENTS,
  PermissionsKeys.READ_DESK_AGENTS,
];
export const UPDATE_AGENTS_PERMISSIONS: PermissionsKeys[] = [
  PermissionsKeys.UPDATE_TEAM_AGENTS,
  PermissionsKeys.UPDATE_DESK_AGENTS,
];

export const CREATE_AGENTS_PERMISSIONS: PermissionsKeys[] = [
  PermissionsKeys.CREATE_TEAM_AGENTS,
  PermissionsKeys.CREATE_DESK_AGENTS,
];

export const DELETE_AGENTS_PERMISSIONS: PermissionsKeys[] = [
  PermissionsKeys.DELETE_TEAM_AGENTS,
  PermissionsKeys.DELETE_DESK_AGENTS,
];
export const READ_LEADS_PERMISSIONS: PermissionsKeys[] = [
  PermissionsKeys.READ_TEAM_LEADS,
  PermissionsKeys.READ_DESK_LEADS,
];
export const UPDATE_LEADS_PERMISSIONS: PermissionsKeys[] = [
  PermissionsKeys.UPDATE_TEAM_LEADS,
  PermissionsKeys.UPDATE_DESK_LEADS,
];
export const DELETE_LEADS_PERMISSIONS: PermissionsKeys[] = [
  PermissionsKeys.DELETE_TEAM_LEADS,
  PermissionsKeys.DELETE_DESK_LEADS,
];
export const TEAM_AGENT_PERMISSIONS: PermissionsKeys[] = [
  PermissionsKeys.DELETE_TEAM_AGENTS,
  PermissionsKeys.READ_TEAM_AGENTS,
  PermissionsKeys.UPDATE_TEAM_AGENTS,
  PermissionsKeys.CREATE_TEAM_AGENTS,
];
export const DESK_AGENT_PERMISSIONS: PermissionsKeys[] = [
  PermissionsKeys.CREATE_DESK_AGENTS,
  PermissionsKeys.UPDATE_DESK_AGENTS,
  PermissionsKeys.READ_DESK_AGENTS,
  PermissionsKeys.DELETE_DESK_AGENTS,
];
export const TEAM_LEADS_PERMISSIONS: PermissionsKeys[] = [
  PermissionsKeys.DELETE_TEAM_LEADS,
  PermissionsKeys.CREATE_TEAM_LEADS,
  PermissionsKeys.UPDATE_TEAM_LEADS,
  PermissionsKeys.READ_TEAM_LEADS,
];
export const TEAM_DESK_PERMISSIONS: PermissionsKeys[] = [
  PermissionsKeys.DELETE_DESK_LEADS,
  PermissionsKeys.CREATE_DESK_LEADS,
  PermissionsKeys.UPDATE_DESK_LEADS,
  PermissionsKeys.READ_DESK_LEADS,
];
export const PERMISSIONS_NEED_VALIDATE: PermissionsKeys[] = [
  ...TEAM_AGENT_PERMISSIONS,
  ...DESK_AGENT_PERMISSIONS,
  ...TEAM_LEADS_PERMISSIONS,
  ...TEAM_DESK_PERMISSIONS,
];
