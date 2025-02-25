import { LeadRepository } from '@/modules/user/repositories';
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Lead } from '@prisma/client';
import { ERROR_MESSAGES } from '@/shared/constants/errors';
import { PrismaService } from '@/shared/db/prisma';
import {
  AgentPermissionRepository,
  AgentRepository,
  DeskRepository,
  RolePermissionRepository,
} from '@/modules/agent/repositories';
import { CreateAgent, UpdateAgent } from '@/modules/agent/dto';
import { AgentPerms } from '@/modules/agent/types/agent-perms.type';
import { UpdateAgentPerms } from '@/modules/agent/dto/update-agent-perms.dto';
import { ArrayUtil } from '@/shared/utils';

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
          const uniqueMap = new Map<number, boolean>();

          for (const perm of permissions) {
            uniqueMap.set(perm.permissionId, perm.allowed);
          }

          const uniqueIncoming = Array.from(uniqueMap.entries()).map(([permissionId, allowed]) => ({
            permissionId,
            allowed,
          }));

          const rolePermissions = await this.rolePermissionRepository.getRolePermissionsByRoleId(
            newAgent.roleId,
          );

          // Выбираем только те разрешения, где значение отличается от дефолтного
          const result: AgentPerms[] = uniqueIncoming.reduce((acc, incoming) => {
            const rolePerm = rolePermissions.find(
              (rp) => rp.permissionId === incoming.permissionId,
            );

            const defaultAllowed = rolePerm ? rolePerm.allowed : false;
            if (incoming.allowed !== defaultAllowed) {
              acc.push({
                agentId: newAgent.id,
                permissionId: incoming.permissionId,
                allowed: incoming.allowed,
              });
            }
            return acc;
          }, [] as AgentPerms[]);

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

  public async updateAgentByPublicId(publicId: string, data: UpdateAgent) {
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

  public async updateAgentPermissionsByPublicId(publicId: string, data: UpdateAgentPerms) {
    const { roleId, permissions } = data;
    if (!roleId && !permissions) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.EMPTY_DATA}`);
    }

    const agent = await this.agentRepository.findOneByPublicId(publicId);
    if (!agent) {
      throw new NotFoundException(`${ERROR_MESSAGES.USER_IS_NOT_EXISTS}`);
    }

    try {
      // Три основных сценария обновления привилегий:
      // 1) Когда указан roleId, но не указаны permissions
      // 2) Когда указаны permissions, но не указан roleId
      // 3) Когда указаны и roleId и permissions
      return await this.prisma.$transaction(async (tx) => {
        // 1) Если указан roleId, но не указаны permissions
        if (roleId && !permissions) {
          const updatedAgent = await this.agentRepository.updateOneWithTx(
            agent.id,
            { roleId },
            tx,
            null,
          );

          const rolePermissions =
            await this.rolePermissionRepository.getRolePermissionsByRoleIdWithTx(roleId, tx);

          const agentPermissions =
            await this.agentPermissionRepository.getAgentPermissionsByAgentIdWithTx(agent.id, tx);

          if (agentPermissions.length === 0) {
            return updatedAgent;
          }
          //Накладываем новый список привилегий по умолчанию, на те что были у агента до этого. При совпадении записей, удаляем их
          let permsToDel: number[] = [];
          agentPermissions.forEach((perm) => {
            const rolePerm = rolePermissions.find((rp) => rp.permissionId === perm.permissionId);
            if (rolePerm && rolePerm.allowed === perm.allowed) {
              permsToDel.push(perm.permissionId);
            }
          });
          if (permsToDel.length > 0) {
            await this.agentPermissionRepository.deleteManyByAgentIdAndPermsIdsWithTx(
              updatedAgent.id,
              permsToDel,
              tx,
            );
          }

          return updatedAgent;
        }
        // 2) Если указаны permissions, но не указан roleId
        else if (!roleId && permissions) {
          // Пробрасываю массив permissions и roleId для поиска тем самым валидируя permissionId на фактическое существование в базе
          const rolePermissions =
            await this.rolePermissionRepository.getRolePermissionsByRoleIdAndPermsIdsWithTx(
              agent.roleId,
              permissions,
              tx,
            );
          if (rolePermissions.length === 0) {
            throw new InternalServerErrorException(`${ERROR_MESSAGES.INVALID_DATA}`);
          }
          //Фильтрую permissions на уникальность permissionId
          const RPids = new Set(rolePermissions.map((rp) => rp.permissionId));
          const filteredIncomingPermissions = permissions.filter((a) => RPids.has(a.permissionId));

          const overrided = filteredIncomingPermissions
            .map((perm) => {
              const rolePerm = rolePermissions.find((rp) => rp.permissionId === perm.permissionId);
              // Если по какой-то причине не нашли соответствие (не должно случиться, но на всякий случай)
              if (!rolePerm) return undefined;
              // Если значение такое же, как в дефолте роли, значит не нужно переопределять
              if (rolePerm.allowed === perm.allowed) return undefined;
              // Иначе возвращаем объект, который реально перезапишем в AgentPermission

              return {
                ...perm,
                agentId: agent.id,
                allowed: perm.allowed,
              };
            })
            .filter((item) => item !== undefined);

          if (overrided.length === 0) {
            await this.agentPermissionRepository.deleteManyByAgentIdWithTx(agent.id, tx);
            return agent;
          }
          await this.agentPermissionRepository.deleteManyByAgentIdWithTx(agent.id, tx);
          await this.agentPermissionRepository.createManyWithTx(overrided, tx);

          return agent;
        }
        // 3) Если указаны и roleId и permissions
        else if (roleId && permissions) {
          const updatedAgent = await this.agentRepository.updateOneWithTx(
            agent.id,
            { roleId },
            tx,
            null,
          );
          // Пробрасываю массив permissions и roleId для поиска тем самым валидируя permissionId на фактическое существование в базе
          const rolePermissions =
            await this.rolePermissionRepository.getRolePermissionsByRoleIdAndPermsIdsWithTx(
              updatedAgent.roleId,
              permissions,
              tx,
            );

          // Если не нашли ни одного разрешения, значит не было указано ни одного валидного permissionId
          if (rolePermissions.length === 0) {
            throw new InternalServerErrorException(`${ERROR_MESSAGES.INVALID_DATA}`);
          }
          //Фильтрую permissions на уникальность permissionId
          const RPids = new Set(rolePermissions.map((rp) => rp.permissionId));
          const filteredIncomingPermissions = permissions.filter((a) => RPids.has(a.permissionId));

          // Перезаписываю разрешения, которые отличаются от дефолтных
          const overrided = filteredIncomingPermissions
            .map((perm) => {
              const rolePerm = rolePermissions.find((rp) => rp.permissionId === perm.permissionId);
              // Если по какой-то причине не нашли соответствие (не должно случиться, но на всякий случай)
              if (!rolePerm) return undefined;
              // Если значение такое же, как в дефолте роли, значит не нужно переопределять
              if (rolePerm.allowed === perm.allowed) return undefined;
              // Иначе возвращаем объект, который реально перезапишем в AgentPermission

              return {
                ...perm,
                agentId: updatedAgent.id,
                allowed: perm.allowed,
              };
            })
            .filter((item) => item !== undefined); // Вырезаю undefined, если такие есть

          if (overrided.length === 0) {
            await this.agentPermissionRepository.deleteManyByAgentIdWithTx(updatedAgent.id, tx);
            return updatedAgent;
          }
          await this.agentPermissionRepository.deleteManyByAgentIdWithTx(updatedAgent.id, tx);
          await this.agentPermissionRepository.createManyWithTx(overrided, tx);

          return updatedAgent;
        } else {
          throw new InternalServerErrorException(`${ERROR_MESSAGES.INVALID_DATA}`);
        }
      });
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR + error.message}`);
    }
  }

  private async getDesksByIds(deskIds: number[] | undefined, tx: any) {
    return deskIds && deskIds.length > 0
      ? this.deskRepository.findManyByIdsWithTx(deskIds, tx)
      : null;
  }
}
