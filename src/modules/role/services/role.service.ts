import {
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
import { MediaDir, MediaPrefix, UpdateMediaParams } from '@/shared/types/media';
import { MediaService } from '@/modules/media';
import { PermissionsTable } from '@/shared/types/permissions';
import { AgentPermissionsService, RolePermissionsService } from '@/modules/permissions/service';

@Injectable()
export class RoleService {
  constructor(
    private readonly roleRepository: RoleRepository,
    private readonly mediaService: MediaService,
    private readonly rolePermissionsService: RolePermissionsService,
    private readonly agentPermissionsService: AgentPermissionsService,
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

        const avatarURL = await this.mediaService.save({
          name: 'avatar',
          publicId: role.publicId,
          file,
          prefix: MediaPrefix.PICTURES,
          dir: MediaDir.ROLES,
        });

        if (avatarURL) {
          role = await this.roleRepository.txUpdateAvatarById(role.id, avatarURL, tx);
        }

        return {
          role,
          permissions,
        };
      });
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
    const role: Role | null = await this.roleRepository.findOneByPublicId(publicId);

    if (!role) throw new NotFoundException();

    if (!role.isMutable || !role.isVisible)
      throw new ForbiddenException(`${ERROR_MESSAGES.DONT_HAVE_RIGHTS}`);

    let avatarURL: string | null = null;

    if (updateMediaParams.isAvatarRemoved) {
      await this.mediaService.remove(publicId, 'avatar', MediaPrefix.PICTURES, MediaDir.ROLES);
      avatarURL = null;
    } else {
      avatarURL = await this.mediaService.save({
        name: 'avatar',
        publicId,
        file: updateMediaParams.file,
        prefix: MediaPrefix.PICTURES,
        dir: MediaDir.ROLES,
      });
    }

    const updatedRole: Role = await this.roleRepository.updateOneByPublicId(
      publicId,
      data,
      avatarURL,
    );
    const permissions: PermissionsTable =
      await this.rolePermissionsService.findManyWithDetailByRoleId(updatedRole.id);

    return {
      role: RolesUtil.mapRoleToClientRole(updatedRole),
      permissions,
    };
  }

  public async deleteRoleByPublicId(publicId: string, deep: boolean) {
    const role = await this.roleRepository.findOneByPublicId(publicId);
    if (!role) throw new InternalServerErrorException(`${ERROR_MESSAGES.DATA_IS_NOT_EXISTS}`);
    if (!role.isMutable || !role.isVisible)
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DONT_HAVE_RIGHTS}`);

    await this.prisma.$transaction(async (tx) => {
      const tempRole: Role | null = await this.roleRepository.txFindOneByPublicId(
        getNoAccessAgentSeedRole().publicId,
        tx,
      );
      if (!tempRole) throw new InternalServerErrorException(`${ERROR_MESSAGES.DATA_IS_NOT_EXISTS}`);
      const agents: Agent[] = await tx.agent.findMany({ where: { roleId: role.id } });
      await tx.agent.updateMany({ where: { roleId: role.id }, data: { roleId: tempRole.id } });

      await this.rolePermissionRepository.txDeleteManyByRoleId(role.id, tx);
      await this.roleRepository.txDeleteOneByPublicId(publicId, tx);

      if (deep) {
        await this.deepDeleteRoleByPublicId(tx, agents, tempRole);
      }
    });
  }

  private async deepDeleteRoleByPublicId(
    tx: Prisma.TransactionClient,
    agents: Agent[],
    tempRole: Role,
  ) {
    const agentIds = agents.map((a) => a.id);
    await this.agentPermissionRepository.txDeleteManyByAgentsIds(agentIds, tx);

    const rolePerms = await this.rolePermissionRepository.txFindManyByRoleId(tempRole.id, tx);

    const agentsPermissions: AllowedPermission[] = [];
    agentIds.forEach((agentId) => {
      const agentPerms = PermissionsUtil.mapRolePermissionsToAgentPermissions(rolePerms, agentId);
      agentsPermissions.push(...agentPerms);
    });

    await this.agentPermissionRepository.txCreateMany(agentsPermissions, tx);
  }
}
