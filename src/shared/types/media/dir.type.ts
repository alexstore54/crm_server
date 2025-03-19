export enum MediaDir {
  LEADS = 'leads',
  AGENTS = 'agents',
  DESKS = 'desks',
  TEAMS = 'teams',
  //#TODO add documents by type (pdf etc)
}

export enum MediaPrefix {
  DEFAULT = 'pictures/default',
  MAIN = 'pictures/main',
  DOCUMENTS = 'documents',
}

export interface MediaDirPath {
  dir: MediaDir;
  prefix: MediaPrefix;
}