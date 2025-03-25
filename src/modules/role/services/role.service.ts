import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { RoleRepository } from '@/modules/role/repositories/role.repository';
import { CreateRole, UpdateRole } from '../dto';
import { PermissionsUtil, RolesUtil } from '@/shared/utils';
import { Agent, Prisma, PrismaClient, Role } from '@prisma/client';
import { AllowedPermission } from '@/modules/permissions/types';
import { ERROR_MESSAGES } from '@/shared/constants/errors';
import { ClientRole, FullRole } from '@/shared/types/roles';
import { MediaDir, UpdateMediaParams } from '@/shared/types/media';
import { MediaImagesService } from '@/modules/media';
import { PrismaPermissionWithDetails } from '@/shared/types/permissions';
import { RolePermissionsService } from '@/modules/permissions/service';
import {
  AgentPermissionRepository,
  RolePermissionRepository,
} from '@/modules/permissions/repositories';
import { getNoAccessAgentSeedRole } from '@/seeds/seed.data';

@Injectable()
export class RoleService {
  constructor(
    private readonly roleRepository: RoleRepository,
    private readonly mediaService: MediaImagesService,
    private readonly rolePermissionsService: RolePermissionsService,
    private readonly rolePermissionsRepository: RolePermissionRepository,
    private readonly agentPermissionRepository: AgentPermissionRepository,
    private readonly prisma: PrismaClient,
  ) {}

  public async createOne(data: CreateRole, file?: Express.Multer.File): Promise<FullRole> {
    const { name, permissions } = data;
    //#REFACTORED - именуй переменные до конца, не одной буквой (p -> permission)
    try {
      const result = await this.prisma.$transaction(async (tx) => {
        let role: Role = await this.roleRepository.txCreateOne(name, tx);
        const prismaRolePermissions = await this.rolePermissionsService.txCreateMany(
          {
            roleId: role.id,
            permissions,
          },
          tx,
        );

        const avatarURL = this.mediaService.setOperationImage({
          name: 'avatar',
          publicId: role.publicId,
          file,
          dir: MediaDir.ROLES,
        });

        if (avatarURL) {
          role = await this.roleRepository.txUpdateAvatarById(role.id, avatarURL, tx);
        }

        return {
          role,
          prismaRolePermissions,
        };
      });

      const { role, prismaRolePermissions } = result;
      if (result.role) {
        await this.mediaService.saveImage();
      }

      return {
        role: RolesUtil.mapRoleToClientRole(role),
        permissions: PermissionsUtil.mapPrismaPermissionsToPermissionTable(prismaRolePermissions),
      };
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  public async getRoles(page: number, limit: number): Promise<ClientRole[]> {
    const roles: Role[] = await this.roleRepository.findMany(page, limit);
    return roles.map((role) => {
      return RolesUtil.mapRoleToClientRole(role);
    });
  }

  //#REFACTORED - упростил логику
  // почистил ненужные методы
  // изменил везде exceptions, по статус кодам (new NotFound, new Forbidden)

  public async getFullRole(publicId: string): Promise<FullRole> {
    const response = await this.roleRepository.findOneFull(publicId);
    if (!response) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DATA_IS_NOT_EXISTS}`);
    }

    const { role, permissions } = response;

    const clientRole = RolesUtil.mapRoleToClientRole(role);
    const permissionsTable = PermissionsUtil.mapPrismaPermissionsToPermissionTable(permissions);

    return {
      role: clientRole,
      permissions: permissionsTable,
    };
  }

  public async updateRoleByPublicId(
    publicId: string,
    data: UpdateRole,
    updateMediaParams: UpdateMediaParams,
  ): Promise<FullRole> {
    const { isAvatarRemoved, file } = updateMediaParams;
    const role: Role | null = await this.roleRepository.findOneByPublicId(publicId);

    if (!role) throw new NotFoundException();

    if (!role.isMutable || !role.isVisible)
      throw new ForbiddenException(`${ERROR_MESSAGES.DONT_HAVE_RIGHTS}`);

    let avatarURL: string | null = null;

    const operatedFile = isAvatarRemoved ? null : file;

    avatarURL = this.mediaService.setOperationImage({
      name: 'avatar',
      publicId,
      file: operatedFile,
      dir: MediaDir.ROLES,
    });

    const result = await this.prisma.$transaction(async (tx) => {
      const updatedRole = await this.roleRepository.txUpdateOneByPublicId(
        publicId,
        data,
        avatarURL,
        tx,
      );
      const prismaRolePermissions: PrismaPermissionWithDetails[] =
        await this.rolePermissionsRepository.txFindFullManyByRoleId(role.id, tx);

      return {
        updatedRole,
        prismaRolePermissions,
      };
    });
    const { updatedRole, prismaRolePermissions } = result;

    if (updatedRole) {
      if (avatarURL === null) {
        await this.mediaService.removeImage();
      } else if (avatarURL !== undefined) {
        await this.mediaService.saveImage();
      }
    }

    return {
      role: RolesUtil.mapRoleToClientRole(updatedRole),
      permissions: PermissionsUtil.mapPrismaPermissionsToPermissionTable(prismaRolePermissions),
    };
  }

  public async deleteRoleByPublicId(publicId: string, isDeep: boolean) {
    const role = await this.roleRepository.findOneByPublicId(publicId);

    if (!role) throw new NotFoundException();

    if (!role.isMutable || !role.isVisible) throw new BadRequestException();

    await this.prisma.$transaction(async (tx) => {
      //#TODO - поставить настоящую роль, а не из сидов юзать!!!
      const tempRole: Role | null = await this.roleRepository.txFindOneByPublicId(
        getNoAccessAgentSeedRole().publicId,
        tx,
      );
      if (!tempRole) throw new InternalServerErrorException(`${ERROR_MESSAGES.DATA_IS_NOT_EXISTS}`);
      const agents: Agent[] = await tx.agent.findMany({ where: { roleId: role.id } });
      await tx.agent.updateMany({ where: { roleId: role.id }, data: { roleId: tempRole.id } });

      await this.rolePermissionsRepository.txDeleteManyByRoleId(role.id, tx);
      await this.roleRepository.txDeleteOneByPublicId(publicId, tx);

      if (isDeep) {
        await this.txDeepDeleteRoleByPublicId(agents, tempRole, tx);
      }
    });
  }

  private async txDeepDeleteRoleByPublicId(
    agents: Agent[],
    tempRole: Role,
    tx: Prisma.TransactionClient,
  ) {
    const agentIds = agents.map((agent) => agent.id);
    await this.agentPermissionRepository.txDeleteManyByAgentsIds(agentIds, tx);

    const rolePerms = await this.rolePermissionsRepository.txFindManyByRoleId(tempRole.id, tx);

    const agentsPermissions: AllowedPermission[] = [];
    agentIds.forEach((agentId) => {
      const agentPerms = PermissionsUtil.mapRolePermissionsToAgentPermissions(rolePerms, agentId);
      agentsPermissions.push(...agentPerms);
    });

    await this.agentPermissionRepository.txCreateMany(agentsPermissions, tx);
  }
}
