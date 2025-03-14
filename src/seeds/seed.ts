import { PrismaService } from '@/shared/db/prisma';
import { configKeys } from '@/shared/schemas';
import {
  getLowAccessAgentSeedRole,
  getModeratorSeedRole,
  getNoAccessAgentSeedRole,
  getPermissions,
  lowAccessPermissions,
} from '@/seeds/seed.data';
import { SEEDS_MESSAGES } from '@/shared/constants/errors';
import { Agent, Permission, Prisma, Role } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { LOW_ACCESS_USER, NO_ACCESS_USER } from '@/shared/constants/tests/agents.constant';
import { FullPermission, PermissionsKeys } from '@/shared/types/permissions';
import { PermissionsUtil } from '@/shared/utils';
import { NodeEnv } from '@/common/config/types';

class Seed {
  private static readonly prisma: PrismaService = new PrismaService();
  private static readonly configService: ConfigService = new ConfigService();

  public static async run(): Promise<void> {
    try {
      await this.prisma.$transaction(async (tx) => {
        const permissions: Permission[] = await this.seedPermissions(tx);

        //по добавлял tx везде
        // мапы дублировались - закинул в утилитту,
        // раскидал по методам

        await this.seedModerator(permissions, tx);

        const envoriment: NodeEnv | undefined = this.configService.get<NodeEnv>(
          configKeys.NODE_ENV,
        );

        if (envoriment && envoriment !== NodeEnv.production) {
          await this.seedTestUsers(permissions, tx);
        }

        console.log(SEEDS_MESSAGES.SEEDS_SUCCESS);
      });
    } catch (error: any) {
      throw new Error(error);
    }
  }

  private static async seedRole(data: any, tx: Prisma.TransactionClient): Promise<Role> {
    try {
      return await tx.role.create({
        data,
      });
    } catch (error: any) {
      const errorMessage = `${SEEDS_MESSAGES.DB_ERROR}: ${error.message}`;

      throw new Error(error);
    }
  }

  private static async seedAgent(data: any, tx: Prisma.TransactionClient): Promise<Agent> {
    try {
      return await tx.agent.create({
        data,
      });
    } catch (error: any) {
      throw new Error(error);
    }
  }

  private static async seedModerator(
    permissions: Permission[],
    tx: Prisma.TransactionClient,
  ): Promise<void> {
    try {
      const moderatorRole: Role = await this.seedRole(getModeratorSeedRole(), tx);
      const moderatorRolePermissionsInput = PermissionsUtil.mapPermissionsToFullPermissions(
        permissions,
        moderatorRole.id,
        true,
      );

      await this.seedRolePermissions(moderatorRolePermissionsInput, tx);
      await this.seedAgent(this.getModeratorInput(moderatorRole.id), tx);
    } catch (error: any) {
      throw new Error(error);
    }
  }

  private static async seedTestUsers(
    permissions: Permission[],
    tx: Prisma.TransactionClient,
  ): Promise<void> {
    try {
      const noAccessRole: Role = await this.seedRole(getNoAccessAgentSeedRole(), tx);
      const lowAccessRole: Role = await this.seedRole(getLowAccessAgentSeedRole(), tx);

      const noAccessRolePermissionsInput = PermissionsUtil.mapPermissionsToFullPermissions(
        permissions,
        noAccessRole.id,
        false,
      );

      const lowAccessPermissionsInput = this.getRolePermissionsList(
        permissions,
        lowAccessPermissions(),
        lowAccessRole.id,
      );

      await this.seedRolePermissions(noAccessRolePermissionsInput, tx);
      await this.seedRolePermissions(lowAccessPermissionsInput, tx);

      await this.seedAgent(this.getNoAccessUserInput(noAccessRole.id), tx);
      await this.seedAgent(this.getLowAccessUserInput(lowAccessRole.id), tx);
    } catch (error: any) {
      throw new Error(error);
    }
  }

  private static async seedPermissions(tx: Prisma.TransactionClient): Promise<Permission[]> {
    try {
      await tx.permission.createMany({
        data: getPermissions().map((key) => ({
          key,
        })),
      });

      return await this.prisma.permission.findMany({});
    } catch (error: any) {
      const errorMessage = `${SEEDS_MESSAGES.DB_ERROR}: ${error.message}`;
      throw new Error(error);
    }
  }

  private static async seedRolePermissions(
    data: FullPermission[],
    tx: Prisma.TransactionClient,
  ): Promise<void> {
    try {
      await tx.rolePermission.createMany({
        data,
      });
    } catch (error: any) {}
  }

  //!
  // private static getRolePermissionsList(
  //   permissions: Permission[],
  //   //поменял тип и имя
  //   allowedKeys: PermissionsKeys[],
  //   roleId: number,
  // ): {   ------------- не пиши возвращаемые возвращаемые значения в виде объектов, добавляй типы, тем более если такой или схожий тип уже встречаестя
  //   roleId: number;
  //   permissionId: number;
  //   allowed: boolean;
  // } ---------------
  //!

  private static getRolePermissionsList(
    permissions: Permission[],
    //поменял тип и имя
    allowedKeys: PermissionsKeys[],
    roleId: number,
  ): FullPermission[] {
    return permissions.map((permission) => {
      // allowedList.find(a_p) - a_p (плохая практика называть одной буквой, юзай всегда полное название)
      const current = allowedKeys.find((key) => key === permission.key);
      if (current) {
        return {
          roleId,
          permissionId: permission.id,
          allowed: true,
        };
      }
      return {
        roleId,
        permissionId: permission.id,
        allowed: false,
      };
    });
  }

  private static getModeratorInput(roleId: number) {
    return {
      //conig[...] заменил на this.configService.get<string>(...)
      email: this.configService.get<string>(configKeys.MODERATOR_EMAIL),
      password: this.configService.get<string>(configKeys.MODERATOR_HASH_PASSWORD),
      lastOnline: null,
      roleId,
    };
  }

  private static getNoAccessUserInput(roleId: number) {
    return {
      email: NO_ACCESS_USER.email,
      password: NO_ACCESS_USER.password,
      lastOnline: null,
      roleId,
    };
  }

  private static getLowAccessUserInput(roleId: number) {
    return {
      email: LOW_ACCESS_USER.email,
      password: LOW_ACCESS_USER.password,
      lastOnline: null,
      roleId,
    };
  }
}

Seed.run();
