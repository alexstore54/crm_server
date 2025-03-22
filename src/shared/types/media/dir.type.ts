export enum MediaDir {
  LEADS = 'leads',
  AGENTS = 'agents',
  DESKS = 'desks',
  TEAMS = 'teams',
  DOCUMENTS = 'documents',
}

export enum MediaPrefix {
  DEFAULT = 'documents',
  PICTURES = 'pictures',
}

export interface MediaDirPath {
  dir: MediaDir;
  prefix: MediaPrefix;
}