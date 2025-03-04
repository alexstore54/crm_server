import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '@/shared/db/prisma';
import { ConfigService } from '@nestjs/config';
import { configKeys } from '@/shared/schemas';
import { getModeratorSeedRole, getPermissions } from '@/seeds/seed.data';
import { AppLoggerService } from '@/modules/logger/services';
import { Agent, LogLevel, Permission, Role } from '@prisma/client';
import { SEEDS_MESSAGES } from '@/shared/constants/errors';

export * from './seed.data';

@Injectable()
export class SeedService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: AppLoggerService,
    private readonly configService: ConfigService,
  ) {}

  public async seed(): Promise<void> {
    try {
      await this.prisma.$transaction(async (tx) => {
        const permissions: Permission[] = await this.seedPermissions();
        const moderatorRole: Role = await this.seedRoles();
        const moderator: Agent = await this.seedModerator();
        await this.seedModeratorPermissions(moderator.id, permissions);
        this.logger.log(SEEDS_MESSAGES.SEEDS_SUCCESS, {
          message: SEEDS_MESSAGES.SEEDS_SUCCESS,
          level: LogLevel.INFO,
        });
      });
    } catch (error: any) {
      this.logError(error);
    }
  }

  private async seedRoles(): Promise<Role> {
    try {
      return await this.prisma.role.create({
        data: getModeratorSeedRole(),
      });
    } catch (error: any) {
      const errorMessage = `${SEEDS_MESSAGES.DB_ERROR}: ${error.message}`;
      this.logError(errorMessage);
      throw new InternalServerErrorException(SEEDS_MESSAGES.DB_ERROR, errorMessage);
    }
  }

  private async seedModerator(): Promise<Agent> {
    try {
      return await this.prisma.agent.create({
        data: this.getModerator(),
      });
    } catch (error: any) {
      const errorMessage = `${SEEDS_MESSAGES.DB_ERROR}: ${error.message}`;
      this.logError(errorMessage);
      throw new InternalServerErrorException(SEEDS_MESSAGES.DB_ERROR, errorMessage);
    }
  }

  private async seedPermissions(): Promise<Permission[]> {
    try {
      await this.prisma.permission.createMany({
        data: getPermissions().map((key) => ({
          key,
        })),
      });

      return await this.prisma.permission.findMany({});
    } catch (error: any) {
      this.logError(error);
      const errorMessage = `${SEEDS_MESSAGES.DB_ERROR}: ${error.message}`;
      throw new InternalServerErrorException(SEEDS_MESSAGES.DB_ERROR, errorMessage);
    }
  }

  private async seedModeratorPermissions(
    moderatorId: number,
    permissions: Permission[],
  ): Promise<void> {
    try {
      await this.prisma.agentPermission.createMany({
        data: permissions.map((permission) => ({
          agentId: moderatorId,
          permissionId: permission.id,
        })),
      });
    } catch (error: any) {
      this.logError(error);
    }
  }

  private getModerator() {
    return {
      email: this.configService.get(configKeys.MODERATOR_EMAIL) as string,
      password: this.configService.get(configKeys.MODERATOR_HASH_PASSWORD) as string,
      lastOnline: null,
      roleId: getModeratorSeedRole().id,
    };
  }

  private logError(errorMessage: string) {
    this.logger.log(errorMessage, {
      message: errorMessage,
      level: LogLevel.ERROR,
    });
  }
}
