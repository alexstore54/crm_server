import { Injectable } from '@nestjs/common';
import { FileSystemService } from '@/modules/media/services/file-system.service';
import { MediaDir, MediaPrefix, SaveInput } from '@/shared/types/media';
import { MediaUtils } from '@/shared/utils';

@Injectable()
export class MediaService {
  constructor(private readonly fileSystem: FileSystemService) {}


  public async removeMany(paths: string[]): Promise<void> {
    await Promise.all(paths.map((path) => this.fileSystem.removeFile(path)));
  }


  public async isFileExist(path: string): Promise<boolean> {
    return this.fileSystem.isExists(path);
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
