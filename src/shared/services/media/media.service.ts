import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MediaDirPath } from '@/shared/types/media';
import { configKeys } from '@/shared/schemas';
import { NodeEnv } from '@/common/config/types';
import { FS_ERRORS } from '@/shared/constants/errors';
import * as filestream from 'fs-extra';
import * as path from 'path';

@Injectable()
export class MediaService {
  private readonly baseMediaDir: string;
  private readonly isProduction: boolean;
  private readonly defaultErrorMessage: string;

  constructor(private readonly configService: ConfigService) {
    this.baseMediaDir = path.resolve(__dirname, 'public', 'media');
    this.isProduction = this.configService.get(configKeys.NODE_ENV) === NodeEnv.production;
    this.defaultErrorMessage = FS_ERRORS.DEFAULT_MESSAGE;
  }

  public async save(filename: string, buffer: Buffer, dirPath: MediaDirPath): Promise<string> {
    try {
      await this.checkFile(filename, dirPath);
      const fullFilePath = path.join(this.getFullPath(dirPath), path.basename(filename));
      await filestream.writeFile(fullFilePath, buffer);
      return fullFilePath;
    } catch (error) {
      throw this.handleError(FS_ERRORS.DEFAULT_MESSAGE);
    }
  }
  public async remove(filename: string, dirPath: MediaDirPath): Promise<void> {
    try {
      const fullFilePath = path.join(this.getFullPath(dirPath), path.basename(filename));
      const fileExists = await filestream.pathExists(fullFilePath);

      if (!fileExists) {
        throw this.handleError(FS_ERRORS.FILE_NOT_EXIST);
      }

      await filestream.remove(fullFilePath);
    } catch (error) {
      throw this.handleError(FS_ERRORS.DEFAULT_MESSAGE);
    }
  }
  public async getBuffer(filename: string, dirPath: MediaDirPath): Promise<Buffer> {
    try {
      const fullFilePath = path.join(this.getFullPath(dirPath), path.basename(filename));
      await this.checkFile(filename, dirPath);
      return await filestream.readFile(fullFilePath);
    } catch (error) {
      throw this.handleError(FS_ERRORS.DEFAULT_MESSAGE);
    }
  }

  private getFullPath(dirPath: MediaDirPath): string {
    const { prefix, dir } = dirPath;
    return path.join(this.baseMediaDir, prefix, dir);
  }

  private async ensureDirectoryExists(directoryPath: string): Promise<void> {
    try {
      await filestream.ensureDir(directoryPath);
    } catch (error) {
      throw this.handleError(FS_ERRORS.DIR_NOT_EXIST);
    }
  }

  private handleError(errorMessage: string): Error {
    const message = this.isProduction ? this.defaultErrorMessage : errorMessage;
    return new InternalServerErrorException(message);
  }

  private async checkDirectory(dirPath: MediaDirPath): Promise<void> {
    const fullPath = this.getFullPath(dirPath);
    await this.ensureDirectoryExists(fullPath);
  }

  private async checkFile(filename: string, dirPath: MediaDirPath): Promise<void> {
    try {
      const fullFilePath = path.join(this.getFullPath(dirPath), path.basename(filename));
      const fileExists = await filestream.pathExists(fullFilePath);

      if (!fileExists) {
        await this.checkDirectory(dirPath);
      }
    } catch (error) {
      throw this.handleError(FS_ERRORS.FILE_NOT_EXIST);
    }
  }
}
