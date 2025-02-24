import { LeadRepository } from '@/modules/users/repositories';
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { AgentRepository } from '../repositories/agent.repository';
import { Agent, Lead } from '@prisma/client';
import { CreateAgent, UpdateAgent } from '../dto';
import { ERROR_MESSAGES } from '@/shared/constants/errors';
import { PrismaService } from '@/shared/db/prisma';
import { DeskRepository } from '../repositories/desk.repository';
import { RolePermissionRepository } from '../repositories/role-permission.repository';
import { AgentPermissionRepository } from '../repositories/agent-permission.repository';
import { AgentPerms } from '../types/agent-perms.type';
import { arraysEqual } from '@/shared/utils/array/arraysEqual';
import { UpdateAgentPerms } from '../dto/update-agent-perms.dto';


@Injectable()
export class AgentService {
  constructor(
    private readonly leadRepository: LeadRepository,
    private readonly agentRepository: AgentRepository,
    private readonly deskRepository: DeskRepository,
    private readonly rolePermissionRepository: RolePermissionRepository,
    private readonly agentPermissionRepository: AgentPermissionRepository,
    private readonly prisma: PrismaService
  ) {}

  async getLeadsByAgentId(agentPublicId: string): Promise<Lead[]> {
    const agent = await this.agentRepository.findOneByPublicId(agentPublicId);
    if (!agent) {
      throw new NotFoundException('Agent not found');
    }

    try {
        return await this.leadRepository.getLeadsByAgent(agent.id);
    } catch (error:any) {
        throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}` + error.message);
    }
  }

  async createAgent(data: CreateAgent){
    const {permissions, deskIds} = data;
    
    try {
          const isExistAgent = await this.agentRepository.findOneByEmail(data.email);
          if (isExistAgent) {
            throw new InternalServerErrorException(`${ERROR_MESSAGES.USER_EXISTS}`);
          }
  
          return this.prisma.$transaction(async (tx) => {
            // Если deskIds переданы – получаем связанные записи, иначе оставляем null
            const desks =
                deskIds && deskIds.length > 0
                  ? await this.deskRepository.findManyByIdsWithTx(deskIds, tx)
                  : null;
      
            // Создаем агента, передавая desks (если они есть, иначе null)
            const newAgent = await this.agentRepository.createOneWithTx(
              data,
              tx,
              desks
            );
      
            // Если переданы разрешения – выполняем их обработку
            if (permissions && permissions.length > 0) {
                // Фильтруем входящие разрешения на уникальность permissionId
                const uniqueMap = new Map<number, boolean>();
                for (const perm of permissions) {
                  uniqueMap.set(perm.permissionId, perm.allowed);
                }
                const uniqueIncoming = Array.from(uniqueMap.entries()).map(
                  ([permissionId, allowed]) => ({ permissionId, allowed })
                );
        
                const rolePermissions =
                  await this.rolePermissionRepository.getRolePermissionsByRoleId(
                    newAgent.roleId
                  );
                // Выбираем только те разрешения, где значение отличается от дефолтного
                const result: AgentPerms[] = uniqueIncoming.reduce((acc, incoming) => {
                  const rolePerm = rolePermissions.find(rp => rp.permissionId === incoming.permissionId);

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
      
    } catch (error:any) {
          throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}` + error.message);
    }
  }
  async updateAgentByPublicId(publicId: string, data: UpdateAgent){
    const {deskIds, ...rest} = data;
    try {
            const currentAgent = await this.agentRepository.findOneByPublicIdWithDesks(publicId);
            if (!currentAgent) {
              throw new NotFoundException(`${ERROR_MESSAGES.USER_IS_NOT_EXISTS}`);
            }
            return await this.prisma.$transaction(async (tx) => {
              let newDeskIds: number[] | null = null;
              
              if (deskIds) {
                    // Получаем валидные записи по переданным deskIds
                    const validDesks = await this.deskRepository.findManyByIdsWithTx(deskIds, tx);
                    const validDeskIds = validDesks.map(desk => desk.id);
                    // Всегда получаем текущие deskIds как массив (даже если пустой)
                    const currentDeskIds = currentAgent.Desk.map(desk => desk.id);
                    
                    // Если наборы отличаются, обновляем связь
                    if (!arraysEqual(currentDeskIds, validDeskIds)) {
                      newDeskIds = validDeskIds;
                    }
              }
              
              return await this.agentRepository.updateOneWithTx(currentAgent.id, { ...rest }, tx, newDeskIds);
            });
    }catch(error:any){
          throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}` + error.message);
    } 
  }
   

  async updateAgentPermissionsByPublicId(publicId: string, data: UpdateAgentPerms){
    const {roleId, permissions} = data;
    try{
        if(!roleId && !permissions){
            throw new InternalServerErrorException(`${ERROR_MESSAGES.EMPTY_DATA}`);
        }
        const agent = await this.agentRepository.findOneByPublicId(publicId);
        if (!agent) {
          throw new NotFoundException(`${ERROR_MESSAGES.USER_IS_NOT_EXISTS}`);
        }
        return await this.prisma.$transaction(async (tx) => {
            if(roleId && !permissions){
                
                const updatedAgent = await this.agentRepository.updateOneWithTx(agent.id, {roleId}, tx, null);
                const rolePermissions = await this.rolePermissionRepository.getRolePermissionsByRoleIdWithTx(roleId, tx);
                const agentPermissions = await this.agentPermissionRepository.getAgentPermissionsByAgentIdWithTx(agent.id, tx);
                
                if(agentPermissions.length === 0){
                    return updatedAgent
                }
                //Накладываем новый список привилегий по умолчанию, на те что были у агента до этого. При совпадении записей, удаляем их
                let permsToDel:number[] = [];
                agentPermissions.forEach(perm => {
                    const rolePerm = rolePermissions.find(rp => rp.permissionId === perm.permissionId);
                    if(rolePerm && rolePerm.allowed === perm.allowed){
                        permsToDel.push(perm.permissionId);
                    }
                })
                if(permsToDel.length > 0){
                    await this.agentPermissionRepository.deleteManyByAgentIdAndPermsIdsWithTx(updatedAgent.id, permsToDel, tx);
                }

                return updatedAgent
            }else if(!roleId && permissions){
                  
                  // Пробрасываю массив permissions и roleId для поиска тем самым валидируя permissionId на фактическое существование в базе
                  const rolePermissions = await this.rolePermissionRepository.getRolePermissionsByRoleIdAndPermsIdsWithTx(agent.roleId, permissions, tx);
                  if(rolePermissions.length === 0){
                      throw new InternalServerErrorException(`${ERROR_MESSAGES.INVALID_DATA}`);
                  }   
                  //Фильтрую permissions на уникальность permissionId
                  const RPids = new Set(rolePermissions.map(rp => rp.permissionId));
                  const filteredIncomingPermissions = permissions.filter(a => RPids.has(a.permissionId));

                  const overrided = filteredIncomingPermissions.map(perm => {
                        const rolePerm = rolePermissions.find(rp => rp.permissionId === perm.permissionId);
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
                    }).filter(item => item !== undefined);

                    if(overrided.length === 0){
                        await this.agentPermissionRepository.deleteManyByAgentIdWithTx(agent.id, tx);
                        return agent
                    }
                    await this.agentPermissionRepository.deleteManyByAgentIdWithTx(agent.id, tx);
                    await this.agentPermissionRepository.createManyWithTx(overrided, tx);


                    return agent;
            }else if(roleId && permissions){
              
                  const updatedAgent = await this.agentRepository.updateOneWithTx(agent.id, { roleId }, tx, null);
                  const rolePermissions = await this.rolePermissionRepository.getRolePermissionsByRoleIdAndPermsIdsWithTx(updatedAgent.roleId, permissions, tx);
                  if(rolePermissions.length === 0){
                      throw new InternalServerErrorException(`${ERROR_MESSAGES.INVALID_DATA}`);
                  }   
                  //Фильтрую permissions на уникальность permissionId
                  const RPids = new Set(rolePermissions.map(rp => rp.permissionId));
                  const filteredIncomingPermissions = permissions.filter(a => RPids.has(a.permissionId));

                  const overrided = filteredIncomingPermissions.map(perm => {
                        const rolePerm = rolePermissions.find(rp => rp.permissionId === perm.permissionId);
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
                    }).filter(item => item !== undefined);

                    if(overrided.length === 0){
                        await this.agentPermissionRepository.deleteManyByAgentIdWithTx(updatedAgent.id, tx);
                        return updatedAgent
                    }
                    await this.agentPermissionRepository.deleteManyByAgentIdWithTx(updatedAgent.id, tx);
                    await this.agentPermissionRepository.createManyWithTx(overrided, tx);


                    return updatedAgent;

              }else {
                  throw new InternalServerErrorException(`${ERROR_MESSAGES.INVALID_DATA}`);
              }
        })


    }catch(error: any){
        throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR + error.message}`)
    }
  }

}
