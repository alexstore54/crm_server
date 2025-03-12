import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '@/shared/db/prisma';
import { ConfigService } from '@nestjs/config';
import { configKeys } from '@/shared/schemas';
import { getModeratorSeedRole, getLowAccessAgentSeedRole, getNoAccessAgentSeedRole, getPermissions, lowAccessPermissions } from '@/seeds/seed.data';
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
        // Создать роль модератора!
        const moderatorRole: Role = await this.seedRoles(getModeratorSeedRole());
        // создать RolePermissions
        // ДЛЯ модератора. Всё Доступно
        await this.seedRolePermissions(permissions.map(p => ({permissionId: p.id, roleId: moderatorRole.id, allowed: true}))); 
        
        // ДЛЯ того у кого НЕТ доступа
        const noAccessRole: Role = await this.seedRoles(getNoAccessAgentSeedRole());
        // ДЛЯ Агента у которого НЕТ прав. Пропускаем seedRolePermissions
        await this.seedRolePermissions(permissions.map(p => ({permissionId: p.id, roleId: noAccessRole.id, allowed: false}))); 
        // ДЛЯ Агента с минимальным кол-ом прав
        const lowAccessRole: Role = await this.seedRoles(getLowAccessAgentSeedRole());
        // создать RolePermissions
        // ДЛЯ Агента. Минимальное кол-во доступных прав
        const somePerms = this.getRolePermissionsList(permissions, lowAccessPermissions(), lowAccessRole.id)
        
        await this.seedRolePermissions(somePerms); 
        
        // Создать модератора 
        const moderator: Agent = await this.seedAgent(this.getModerator());
        //Создать Агента БЕЗ прав
        const noAccessUser: Agent = await this.seedAgent(this.getNoAccessUser());
        //Создать Агента с минимальным кол-ом прав
        const lowAccessUser: Agent = await this.seedAgent(this.getLowAccessUser());
        //-------------------------------------------------//
        
        
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

  private async seedAgent(data:any): Promise<Agent> {
    try {
      return await this.prisma.agent.create({
        data
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

  private async seedRolePermissions(
    data: {roleId: number, permissionId: number, allowed: boolean}[],
  ): Promise<void> {
    try {
      await this.prisma.rolePermission.createMany({
            data 
      });
    } catch (error: any) {
          this.logError(error);
    }
  }

  private getRolePermissionsList(permissions: Permission[], allowedList: string[], roleId: number):{roleId:number, permissionId: number, allowed: boolean}[]{
      return permissions.map(perm => {
          const current = allowedList.find(a_p => a_p === perm.key);
          if(current){
            return {
                    roleId,
                    permissionId: perm.id,
                    allowed: true
                  }
          }
          return {
                  roleId,
                  permissionId: perm.id,
                  allowed: false
              }

  })
} 

  private getModerator() {
      return {
        email: this.configService.get(configKeys.MODERATOR_EMAIL) as string,
        password: this.configService.get(configKeys.MODERATOR_HASH_PASSWORD) as string,
        lastOnline: null,
        roleId: getModeratorSeedRole().id,
      };
  }
  private getNoAccessUser() {
      return {
        email: this.configService.get(configKeys.NO_ACCESS_USER) as string,
        password: this.configService.get(configKeys.NO_ACCESS_USER_HASH_PASSWORD) as string,
        lastOnline: null,
        roleId: getNoAccessAgentSeedRole().id,
      };
  }

  private getLowAccessUser() {
    return {
      email: this.configService.get(configKeys.LOW_ACCESS_USER) as string,
      password: this.configService.get(configKeys.LOW_ACCESS_USER_HASH_PASSWORD) as string,
      lastOnline: null,
      roleId: getLowAccessAgentSeedRole().id,
    };
}

  private logError(errorMessage: string) {
      this.logger.log(errorMessage, {
        message: errorMessage,
        level: LogLevel.ERROR,
      });
  }
}
