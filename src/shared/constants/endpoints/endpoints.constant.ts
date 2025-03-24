export const ENDPOINTS = {
  HEALTH: {
    BASE: 'health',
    GET_HEALTH_CHECK: '/',
  },
  AUTH: {
    BASE: 'auth',
    GET_CSRF_TOKEN: 'csrf-token',
  },
  AUTH_AGENT: {
    BASE: 'auth/agent',
    SIGN_IN: 'sign-in',
    REFRESH: 'refresh',
    LOGOUT: 'logout',
  },
  AUTH_CUSTOMER: {
    BASE: 'auth/customer',
    SIGN_IN: 'sign-in',
    SIGN_UP: 'sign-up',
    REFRESH: 'refresh',
    LOGOUT: 'logout',
  },
  AUTH_GOOGLE: {
    BASE: 'auth/oauth/google',
  },
  AGENT: {
    BASE: 'agent',
    GET_MY_LEADS: 'my-leads',
    GET_ME: 'me',
    UPDATE_ME: 'update-me',
  },
  AGENTS: {
    BASE: 'agents',
    GET_AGENT_LEADS: ':publicId/leads',
    CREATE_AGENT: 'create',
    UPDATE_AGENT: ':publicId/update',
  },
  AGENT_PERMISSIONS: {
    BASE: 'permissions/agents',
    GET_AGENT_PERMISSIONS: ':publicId',
    UPDATE_AGENT_PERMISSIONS: ':publicId/update',
  },
  ROLES_PERMISSIONS: {
    BASE: 'permissions/roles',
    UPDATE_ROLE_PERMISSIONS: ':publicId/update',
    UPDATE_DEEP_ROLE_PERMISSIONS: ':publicId/deep-update',
  },
  ROLES: {
    BASE: 'roles',
    GET_ONE: ':publicId',
    GET_MANY: '/',
    CREATE_ONE: 'create',
    UPDATE_ONE_ROLE: ':publicId/update',
    DELETE_ONE: ':publicId',
  },
  AGENTS_SESSIONS: {
    BASE: 'sessions/agents',
    GET_AGENT_SESSIONS: ':publicId',
    DELETE_ALL: ':publicId',
  },
  TEAMS: {
    BASE: 'teams',
    CREATE_TEAM: 'create',
    UPDATE_TEAM: ':publicId/update',
    GET_TEAM: ':publicId',
    DELETE_TEAM: ':publicId',
    GET_ALL_TEAMS: '/',
  },
  LOGS: {
    BASE: 'logs',
    GET_LOGS: '/',
    GET_USERS_LOGS: '/users/:publicId',
    GET_ONE_LOG: ':id',
  },
  CUSTOMER_SESSIONS: {
    BASE: 'sessions/customers',
    GET_CUSTOMER_SESSIONS: ':publicId',
    DELETE_ALL: ':publicId',
  },
  MY_SESSIONS: {
    BASE: 'sessions/my',
    GET_ALL_MY_SESSIONS: '/',
    DELETE_ALL: 'all',
  },
  DESKS_ADMINS: {
    BASE: 'desks/:publicId/shifts',
    GET_ADMINS: '/',
    ASSIGN_SHIFT: 'assign',
    UNASSIGN_SHIFT: 'unassign',
  },
  DESKS: {
    BASE: 'desks',
    GET_DESK_TEAMS: ':publicId/teams',
    GET_DESK: ':publicId',
    CREATE_DESK: 'create',
    UPDATE_DESK: ':publicId/update',
    DELETE_DESK: ':publicId',
    GET_ALL_DESKS: '/',
  },
  LEADS: {
    BASE: 'leads',
    GET_LEAD: ':publicId',
    GET_ALL_LEADS: '/',
    CREATE_LEAD: 'create',
    UPDATE_LEAD: ':publicId/update',
    DELETE_LEAD: ':publicId',
  },
  LEADS_CALLBACK: {
    BASE: 'leads/callback',
  },
  MEDIA: {
    BASE: 'media',
    GET_DOCUMENT: 'documents/:publicId',
    GET_MANY_DOCUMENTS: 'documents',
    GET_PICTURES: 'pictures/:publicId',
    GET_MANY_PICTURES: 'pictures',
  }
};
