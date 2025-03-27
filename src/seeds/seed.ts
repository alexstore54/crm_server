import { PrismaService } from '@/shared/db/prisma';
import { configKeys } from '@/shared/schemas';
import {
  getCanadaDesk,
  getItalyDesk,
  getLowAccessAgentSeedRole,
  getModeratorSeedRole,
  getNoAccessAgentSeedRole,
  getPermissions,
  getUnsignedDesk,
  lowAccessPermissions,
} from '@/seeds/seed.data';
import { SEEDS_MESSAGES } from '@/shared/constants/errors';
import { Agent, AgentPermission, Desk, Permission, Prisma, Role, RolePermission } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { LOW_ACCESS_USER, NO_ACCESS_USER } from '@/shared/constants/tests/agents.constant';
import { FullAgentPermission, FullPermission, PermissionsKeys } from '@/shared/types/permissions';
import { PermissionsUtil } from '@/shared/utils';
import { NodeEnv } from '@/common/config/types';

type nameDesk = "ItalyDesk" | "UnsignedDesk" | "CanadaDesk"
type Desks = Record<nameDesk, Desk>;

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
            const desks = await this.seedDesks(tx)
            await this.seedTestUsers(permissions, desks, tx);
        }

        console.log(SEEDS_MESSAGES.SEEDS_SUCCESS);
      });
    } catch (error: any) {
      console.log(error)
      throw new Error(error);
    }
  }

  private static async seedDesks(tx: Prisma.TransactionClient){
    try{
       return {
            ItalyDesk: await tx.desk.create({data: {...getItalyDesk()}}),
            UnsignedDesk: await tx.desk.create({data: {...getUnsignedDesk()}}),
            CanadaDesk: await tx.desk.create({data: {...getCanadaDesk()}})
       }

    }catch(error: any){
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
        data
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
      console.log(moderatorRole)
      const moderatorRolePermissionsInput = PermissionsUtil.mapPermissionsToFullPermissions(
            permissions,
            moderatorRole.id,
            true,
      );
      const moderatorAgentPermissionsInput = PermissionsUtil.mapPermissionsToFullPermissions(
        permissions,
        moderatorRole.id,
        true,
      );


      const dbRolePermissions = await this.seedRolePermissions(moderatorRolePermissionsInput, tx);
      const moderator = await this.seedAgent(this.getModeratorInput(moderatorRole.id), tx);
      // permissionId, agentId, allowed
      await this.seedAgentPermissions(this.getAgentPermissionsList(dbRolePermissions, moderator.id), tx)  

    } catch (error: any) {
      throw new Error(error);
    }
  }

  private static async seedTestUsers(
    permissions: Permission[],
    desks: Desks,
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

      const noAccessRolePermissions = await this.seedRolePermissions(noAccessRolePermissionsInput, tx);
      const lowAccessRolePermissions = await this.seedRolePermissions(lowAccessPermissionsInput, tx);

      const noAccessAgent = await this.seedAgent(this.getNoAccessUserInput(noAccessRole.id, desks.UnsignedDesk.id), tx);
      const lowAccessAgent = await this.seedAgent(this.getLowAccessUserInput(lowAccessRole.id, [desks.ItalyDesk, desks.CanadaDesk]), tx);

      await this.seedAgentPermissions(this.getAgentPermissionsList(noAccessRolePermissions, noAccessAgent.id), tx)
      await this.seedAgentPermissions(this.getAgentPermissionsList(lowAccessRolePermissions, lowAccessAgent.id), tx)

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

      return await tx.permission.findMany({});
    } catch (error: any) {
      const errorMessage = `${SEEDS_MESSAGES.DB_ERROR}: ${error.message}`;
      throw new Error(error);
    }
  }

  private static async seedAgentPermissions(
    data: FullAgentPermission[],
    tx: Prisma.TransactionClient
  ): Promise<AgentPermission[]>{
    try{
      return await tx.agentPermission.createManyAndReturn({data})
    }catch(error: any){
      throw error
    }
  }

  private static async seedRolePermissions(
    data: FullPermission[],
    tx: Prisma.TransactionClient
  ): Promise<RolePermission[]> {
    try {
      return await tx.rolePermission.createManyAndReturn({data});
    } catch (error: any) {
      throw error; 
    }
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
  private static getAgentPermissionsList(
    rolePermissions: RolePermission[],
    agentId: number
  ){
    return rolePermissions.map(rp => {
        return {
            permissionId: rp.permissionId,
            allowed: rp.allowed,
            agentId
        }
    })
  }

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

  private static getNoAccessUserInput(roleId: number, deskId: number) {
    return {
      email: NO_ACCESS_USER.email,
      password: NO_ACCESS_USER.password,
      lastOnline: null,
      roleId,
      Desk: {
        connect: {id: deskId}
      }
    };
  }

  private static getLowAccessUserInput(roleId: number, desks: Desk[]) {
    return {
      email: LOW_ACCESS_USER.email,
      password: LOW_ACCESS_USER.password,
      lastOnline: null,
      roleId,
      Desk : {
        connect: desks.map(desk => ({id: desk.id}))
      }
    };
  }
}

Seed.run();
