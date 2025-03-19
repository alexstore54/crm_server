export enum MediaDir {
  LEADS = 'leads',
  AGENTS = 'agents',
  DESKS = 'desks',
  TEAMS = 'teams',
}

export enum MediaPrefix {
  DEFAULT = 'default',
  MAIN = 'main',
}

export interface MediaDirPath {
  dir: MediaDir;
  prefix: MediaPrefix;
}