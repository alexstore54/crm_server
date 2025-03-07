import { LeadRepository } from '@/modules/user/repositories';
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Lead, Prisma } from '@prisma/client';
import { ERROR_MESSAGES } from '@/shared/constants/errors';
import { PrismaService } from '@/shared/db/prisma';
import {
  AgentPermissionRepository,
  AgentRepository,
  DeskRepository,
  RolePermissionRepository,
} from '@/modules/agent/repositories';
import { CreateAgent, UpdateAgent } from '@/modules/agent/dto';
import { AgentPermission } from '@/modules/permissions/types/agent-perms.type';
import { AgentPermissionsUtil, ArrayUtil } from '@/shared/utils';
import { PermissionsKeys } from '@/shared/types/auth';

@Injectable()
export class AgentService {
  constructor(
    private readonly leadRepository: LeadRepository,
    private readonly agentRepository: AgentRepository,
    private readonly deskRepository: DeskRepository,
    private readonly rolePermissionRepository: RolePermissionRepository,
    private readonly agentPermissionRepository: AgentPermissionRepository,
    private readonly prisma: PrismaService,
  ) {}

  public async getLeadsByPublicId(publicId: string): Promise<Lead[]> {
    const agent = await this.agentRepository.findOneByPublicId(publicId);
    if (!agent) {
      throw new NotFoundException(ERROR_MESSAGES.AGENT_NOT_FOUND);
    }

    try {
      return await this.leadRepository.getLeadsByAgentId(agent.id);
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}` + error.message);
    }
  }

  public async createAgent(data: CreateAgent) {
    const { permissions, deskIds } = data;

    const isExistAgent = await this.agentRepository.findOneByEmail(data.email);
    if (isExistAgent) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.USER_EXISTS}`);
    }

    try {
      return this.prisma.$transaction(async (tx) => {
        // Если deskIds переданы – получаем связанные записи, иначе оставляем null
        const desks = await this.getDesksByIds(deskIds, tx);

        // Создаем агента, передавая desks (если они есть, иначе null)
        const newAgent = await this.agentRepository.createOneWithTx(data, tx, desks);

        // Если переданы разрешения – выполняем их обработку
        if (permissions && permissions.length > 0) {
          // Фильтруем входящие разрешения на уникальность permissionId
          const uniqueIncoming = AgentPermissionsUtil.filterUniquePermissions(permissions);

          const rolePermissions = await this.rolePermissionRepository.getRolePermissionsByRoleId(
            newAgent.roleId,
          );

          // Выбираем только те разрешения, где значение отличается от дефолтного
          const result: AgentPermission[] = AgentPermissionsUtil.filterPermissionsByRoleDefaults(
            uniqueIncoming,
            rolePermissions,
            newAgent.id,
          );

          // Создаем записи в agentPermission, если есть расхождения
          if (result.length > 0) {
            await this.agentPermissionRepository.createManyWithTx(result, tx);
          }
        }
        return newAgent;
      });
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}` + error.message);
    }
  }

  public async updateByPublicId(publicId: string, data: UpdateAgent) {
    const { deskIds, ...rest } = data;

    const currentAgent = await this.agentRepository.findOneByPublicIdWithDesks(publicId);
    if (!currentAgent) {
      throw new NotFoundException(`${ERROR_MESSAGES.USER_IS_NOT_EXISTS}`);
    }

    try {
      return this.prisma.$transaction(async (tx) => {
        let newDeskIds: number[] | null = null;

        if (deskIds) {
          // Получаем валидные записи по переданным deskIds
          const validDesks = await this.deskRepository.findManyByIdsWithTx(deskIds, tx);
          const validDeskIds = validDesks.map((desk) => desk.id);
          // Всегда получаем текущие deskIds как массив (даже если пустой)
          const currentDeskIds = currentAgent.Desk.map((desk) => desk.id);

          // Если наборы отличаются, обновляем связь
          if (!ArrayUtil.isArraysEqual(currentDeskIds, validDeskIds)) {
            newDeskIds = validDeskIds;
          }
        }

        return await this.agentRepository.updateOneWithTx(
          currentAgent.id,
          { ...rest },
          tx,
          newDeskIds,
        );
      });
    } catch (error: any) {
        throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}` + error.message);
    }
  }
  public async getOneByPublicId(publicId: string){
      try{
          return this.agentRepository.findOneByPublicIdWithDesks(publicId);
      }catch(error: any){
        throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}` + error.message);
      }
  }

  
  private async getDesksByIds(deskIds: number[] | undefined, tx: Prisma.TransactionClient) {
    return deskIds && deskIds.length > 0
      ? this.deskRepository.findManyByIdsWithTx(deskIds, tx)
      : null;
  }
}
