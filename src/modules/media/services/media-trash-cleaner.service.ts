import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MediaImagesService } from '@/modules/media';
import { AppLoggerService } from '@/modules/logger/services';
import { PrismaService } from '@/shared/db/prisma';
import { MediaDir, MediaPrefix, RemoveMediaParams } from '@/shared/types/media';
import { MediaUtils } from '@/shared/utils';
import { ERROR_MESSAGES } from '@/shared/constants/errors';
import { CRON_CONFIG } from 'shared/constants/cron';
import { LogLevel } from '@prisma/client';
import { LogOperationType } from '@/shared/types/logger';

@Injectable()
export class MediaTrashCleanerService {
  constructor(
    private readonly mediaService: MediaImagesService,
    private readonly logger: AppLoggerService,
    private readonly prisma: PrismaService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  private async handleClearAvatar() {
    this.logStart();

    try {
      const pathsToRemove: string[] = [];
      const agentAvatarsPaths = await this.getAgentAvatarsPaths();
      if (agentAvatarsPaths.length) pathsToRemove.push(...agentAvatarsPaths);

      const rolesAvatarsPaths = await this.getRolesAvatarsPaths();
      if (rolesAvatarsPaths.length) pathsToRemove.push(...rolesAvatarsPaths);

      const deskAvatarsPaths = await this.getDeskAvatarsPaths();
      if (deskAvatarsPaths.length) pathsToRemove.push(...deskAvatarsPaths);

      const customerAvatarsPaths = await this.getCustomerAvatarsPaths();
      if (customerAvatarsPaths.length) pathsToRemove.push(...customerAvatarsPaths);

      const teamAvatarsPaths = await this.getTeamAvatarsPaths();
      if (teamAvatarsPaths.length) pathsToRemove.push(...teamAvatarsPaths);

      if (pathsToRemove.length) {
        const filteredPaths = await this.filterExistingPaths(pathsToRemove);
        await this.mediaService.removeManyFiles(filteredPaths);
        this.logSuccess(filteredPaths.length);
      } else {
        this.logNothingToClear();
      }
    } catch (error) {
      this.logError();
      throw new InternalServerErrorException();
    }
  }

  private async getAgentAvatarsPaths(): Promise<string[]> {
    try {
      const agentsMediaToRemove: RemoveMediaParams[] = await this.prisma.agent.findMany({
        where: { avatarURL: { not: null } },
        select: { publicId: true, avatarURL: true },
      });

      return this.mapPaths(MediaPrefix.IMAGES, MediaDir.AGENTS, agentsMediaToRemove);
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  private async getRolesAvatarsPaths(): Promise<string[]> {
    try {
      const rolesMediaToRemove: RemoveMediaParams[] = await this.prisma.role.findMany({
        where: { avatarURL: { not: null } },
        select: { publicId: true, avatarURL: true },
      });

      return this.mapPaths(MediaPrefix.IMAGES, MediaDir.AGENTS, rolesMediaToRemove);
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  private async getDeskAvatarsPaths(): Promise<string[]> {
    try {
      const deskMediaToRemove: RemoveMediaParams[] = await this.prisma.desk.findMany({
        where: { avatarURL: { not: null } },
        select: { publicId: true, avatarURL: true },
      });

      return this.mapPaths(MediaPrefix.IMAGES, MediaDir.DESKS, deskMediaToRemove);
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  private async getCustomerAvatarsPaths(): Promise<string[]> {
    try {
      const customerMediaToRemove: RemoveMediaParams[] = await this.prisma.customer.findMany({
        where: { avatarURL: { not: null } },
        select: { publicId: true, avatarURL: true },
      });

      return this.mapPaths(MediaPrefix.IMAGES, MediaDir.CUSTOMERS, customerMediaToRemove);
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  private async getTeamAvatarsPaths(): Promise<string[]> {
    try {
      const teamMediaToRemove: RemoveMediaParams[] = await this.prisma.team.findMany({
        where: { avatarURL: { not: null } },
        select: { publicId: true, avatarURL: true },
      });

      return this.mapPaths(MediaPrefix.IMAGES, MediaDir.TEAMS, teamMediaToRemove);
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  private async filterExistingPaths(paths: string[]): Promise<string[]> {
    for (const path of paths) {
      if (!(await this.mediaService.isFileExist(path))) {
        paths = paths.filter((filteredPath) => filteredPath !== path);
      }
    }
    return paths;
  }

  private mapPaths(prefix: MediaPrefix, dir: MediaDir, removeData: RemoveMediaParams[]): string[] {
    return removeData
      .filter((objectToRemove) => objectToRemove.avatarURL)
      .map((objectToRemove) =>
        MediaUtils.mapPath(objectToRemove.publicId, objectToRemove.avatarURL!, prefix, dir),
      );
  }

  private logStart() {
    this.logger.log(CRON_CONFIG.MEDIA_TRASH.START, {
      message: CRON_CONFIG.MEDIA_TRASH.START,
      level: LogLevel.INFO,
      context: {
        path: CRON_CONFIG.MEDIA_TRASH.PATH,
        operationType: LogOperationType.CRON,
      },
    });
  }

  private logSuccess(countOfRemoved: number) {
    const message = CRON_CONFIG.MEDIA_TRASH.SUCCESS.replace('{count}', countOfRemoved.toString());
    this.logger.log(CRON_CONFIG.MEDIA_TRASH.SUCCESS, {
      message: CRON_CONFIG.MEDIA_TRASH.SUCCESS,
      level: LogLevel.INFO,
      context: {
        path: CRON_CONFIG.MEDIA_TRASH.PATH,
        operationType: LogOperationType.CRON,
      },
    });
  }

  private logError() {
    this.logger.log(CRON_CONFIG.MEDIA_TRASH.ERROR, {
      message: CRON_CONFIG.MEDIA_TRASH.ERROR,
      level: LogLevel.INFO,
      context: {
        path: CRON_CONFIG.MEDIA_TRASH.PATH,
        operationType: LogOperationType.CRON,
      },
    });
  }

  private logNothingToClear() {
    this.logger.log(CRON_CONFIG.MEDIA_TRASH.NOTHING_TO_CLEAR, {
      message: CRON_CONFIG.MEDIA_TRASH.NOTHING_TO_CLEAR,
      level: LogLevel.INFO,
      context: {
        path: CRON_CONFIG.MEDIA_TRASH.PATH,
        operationType: LogOperationType.CRON,
      },
    });
  }
}
