import { Injectable } from '@nestjs/common';
import { FileSystemService } from '@/modules/media/services/file-system.service';
import { MediaDir, MediaPrefix, SaveInput } from '@/shared/types/media';
import { MediaUtils } from '@/shared/utils';

@Injectable()
export class MediaService {
  constructor(private readonly fileSystem: FileSystemService) {}

  public async save(args: SaveInput): Promise<string | null> {
    const { publicId, file, prefix, dir, name } = args;
    if (!file) {
      return null;
    }
    const filename = name || file.originalname;
    const saveData = MediaUtils.getUploadMediaData(publicId, filename, file, prefix, dir);
    const src = await this.fileSystem.save(saveData);
    return MediaUtils.realPathToEndpointPath(src);
  }

  public async remove(
    publicId: string,
    filename: string,
    prefix: MediaPrefix,
    dir: MediaDir,
  ): Promise<void> {
    const dirPath = { prefix, dir };
    await this.fileSystem.remove(publicId, filename, dirPath);
  }
}
