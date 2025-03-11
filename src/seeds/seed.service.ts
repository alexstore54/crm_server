import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '@/shared/db/prisma';
import { ConfigService } from '@nestjs/config';
import { configKeys } from '@/shared/schemas';
import { getModeratorSeedRole, lowAccessAgentSeedRole, noAccessAgentSeedRole, getPermissions, lowAccessPermissions } from '@/seeds/seed.data';
import { AppLoggerService } from '@/modules/logger/services';
import { Agent, AgentPermission, LogLevel, Permission, Role } from '@prisma/client';
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
        //await this.seedPermissions();
        
        const moderatorRole: Role = await this.seedRoles(getModeratorSeedRole());
        const noAccessRole: Role =  await this.seedRoles(noAccessAgentSeedRole());
        const minAccessRole: Role = await this.seedRoles(lowAccessAgentSeedRole());
        
        
        const moderatorPermissions = await this.getRolePermissionsList(permissions.map(p => p.key), moderatorRole.id)
        const noAccessPermissions  = await this.getRolePermissionsList([], noAccessRole.id)
        const minAccessPermissions = await this.getRolePermissionsList(lowAccessPermissions(), minAccessRole.id)


        await this.seedModeratorRolePermissions(moderatorPermissions);
        await this.seedModeratorRolePermissions(noAccessPermissions);
        await this.seedModeratorRolePermissions(minAccessPermissions);
        
        const moderator: Agent = await this.seedModerator();
        
        //await this.seedModeratorPermissions(moderator.id, permissions); 
        
        this.logger.log(SEEDS_MESSAGES.SEEDS_SUCCESS, {
            message: SEEDS_MESSAGES.SEEDS_SUCCESS,
            level: LogLevel.INFO,
        });
      });
    } catch (error: any) {
      this.logError(error);
    }
  }

  private async seedRoles(data: any): Promise<Role> {
    try {
      return await this.prisma.role.create({
        data
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
        data: getPermissions().map(key => ({
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
        data: permissions.map<AgentPermission>((permission) => ({
          agentId: moderatorId,
          allowed: true,
          permissionId: permission.id,
        })),
      });
    } catch (error: any) {
      this.logError(error);
    }
  }

  private async seedModeratorRolePermissions(
    data: any,
  ): Promise<void> {
    try {
      await this.prisma.rolePermission.createMany({
            data 
      });
    } catch (error: any) {
          this.logError(error);
    }
  }

  private async getRolePermissionsList(allowedList: string[], roleId: number){
      try{
          const [allowed, disallowed] = await Promise.all([
                this.prisma.permission.findMany({where: {key: {in: allowedList}}}),
                this.prisma.permission.findMany({where: {key: {notIn: allowedList}}})
          ])

          const allowedPermissions = allowed.map(permission => ({permissionId: permission.id, allowed: true, roleId}))
          const disallowedPermissions = disallowed.map(permission => ({permissionId: permission.id, allowed: false, roleId}))

          return [...allowedPermissions, ...disallowedPermissions]
          
      }catch(error: any){
          this.logError(error);
          return
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
