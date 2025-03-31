import { Injectable, InternalServerErrorException, Scope } from '@nestjs/common';
import { FileSystemService } from '@/modules/media/services/file-system.service';
import { MediaDir, MediaPrefix, TempImageInput } from '@/shared/types/media';
import { MediaUtils } from '@/shared/utils';
import { ERROR_MESSAGES } from '@/shared/constants/errors';

@Injectable({ scope: Scope.TRANSIENT })
export class MediaImagesService {
  private operatedImagePath: string | null = null;
  constructor(private readonly fileSystem: FileSystemService) {}

  public async removeManyFiles(paths: string[]): Promise<void> {
    await Promise.all(paths.map((path) => this.fileSystem.removeFile(path)));
  }

  public setOperationImage(args: TempImageInput): string | null {
    const { file, dir, publicId, name } = args;
    let filename: string | null = null;

    if (file === undefined) {
      return null;
    }

    const path = MediaUtils.mapPath(publicId, name, MediaPrefix.IMAGES, dir);
    this.operatedImagePath = path;
    return MediaUtils.realPathToEndpointPath(path);
  }

  public async saveImage() {
    if (!this.operatedImagePath) {
      throw new InternalServerErrorException(ERROR_MESSAGES.SAVED_MEDIA_NOT_FOUND);
    }
    await this.fileSystem.saveFile(this.operatedImagePath);
    this.operatedImagePath = null;
  }

  public async isFileExist(path: string): Promise<boolean> {
    return this.fileSystem.isExists(path);
  }

  public async getImageForEndpointBASE64(
    name: string,
    publicId: string,
    dir: MediaDir,
  ): Promise<string> {
    const path = MediaUtils.mapPath(publicId, name, MediaPrefix.IMAGES, dir);
    return this.fileSystem.getBase64File(path);
  }

  public async removeImage(): Promise<void> {
    if (!this.operatedImagePath) {
      throw new InternalServerErrorException(ERROR_MESSAGES.SAVED_MEDIA_NOT_FOUND);
    }
    await this.fileSystem.removeFile(this.operatedImagePath);
    this.operatedImagePath = null;
  }
}
