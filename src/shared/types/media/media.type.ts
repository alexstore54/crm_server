import { MediaDir, MediaDirPath, MediaPrefix } from '@/shared/types/media/dir.type';

export interface SaveMediaArgs {
  filename: string;
  publicId: string;
  mimetype: string;
  dirPath: MediaDirPath;
  buffer: Buffer,
}


export interface SaveInput {
  publicId: string;
  name?: string;
  file?: Express.Multer.File;
  prefix: MediaPrefix;
  dir: MediaDir;
}

export interface UpdateMediaParams {
  isAvatarRemoved?: boolean;
  file?: Express.Multer.File;
}