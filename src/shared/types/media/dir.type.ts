export enum MediaDir {
  CUSTOMERS = 'customers',
  AGENTS = 'agents',
  DESKS = 'desks',
  ROLES = 'roles',
  TEAMS = 'teams',
}

export enum MediaPrefix {
  IMAGES = 'images',
  DOCUMENTS = 'documents',
}

export interface MediaDirPath {
  dir: MediaDir;
  prefix: MediaPrefix;
}