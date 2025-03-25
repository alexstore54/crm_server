import { MediaDir, MediaPrefix, SaveMediaArgs } from '@/shared/types/media';
import * as path from 'node:path';

export class MediaUtils {
  private static readonly BASE_PATH = 'public/medias';

  public static getUploadMediaData(
    publicId: string,
    name: string,
    file: Express.Multer.File,
    prefix: MediaPrefix,
    dir: MediaDir,
  ): SaveMediaArgs {
    return {
      mimetype: file.mimetype,
      filename: name,
      publicId: publicId,
      buffer: file.buffer,
      dirPath: {
        dir,
        prefix,
      },
    };
  }

  public static realPathToEndpointPath(realPath: string): string {
    if (!realPath.startsWith(this.BASE_PATH)) {
      throw new Error('Invalid real path');
    }
    return realPath.replace(this.BASE_PATH, 'medias');
  }

  public static endpointPathToRealPath(endpointPath: string): string {
    if (!endpointPath.startsWith('medias')) {
      throw new Error('Invalid endpoint path');
    }
    return endpointPath.replace('medias', this.BASE_PATH);
  }

  public static mapPath(publicId: string, filename: string, prefix: MediaPrefix, dir: MediaDir) {
    return path.join(this.BASE_PATH, prefix, dir, publicId, filename);
  }
}
