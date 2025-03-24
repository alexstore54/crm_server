import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { RoleRepository } from "../repositories/role.repository";
import { Agent, Permission, Prisma, Role, RolePermission } from "@prisma/client";
import { CreateRole, UpdateRole } from "../dto/createRole.dto";
import { AgentPermissionRepository, AgentRepository, RolePermissionRepository } from "@/modules/agent/repositories";
import { PermissionRepository } from "@/modules/permissions/repositories";
import { ERROR_MESSAGES } from "@/shared/constants/errors";
import { PermissionsUtil } from "@/shared/utils";
import { PrismaService } from "@/shared/db/prisma";
import { plainToInstance } from "class-transformer";
import { RoleAndPermissionsResponse, RolesResponse, SingleRoleResponse } from "../dto/responseRole.dto";
import { RolesUtil } from "@/shared/utils/roles/roles.util";
import { getNoAccessAgentSeedRole } from "@/seeds/seed.data";
import { AllowedPermission } from "@/modules/permissions/types";

@Injectable()
export class RoleService {
    constructor(
        private readonly rolePermissionRepository: RolePermissionRepository,
        private readonly agentPermissionRepository: AgentPermissionRepository,
        private readonly permissionRepository: PermissionRepository,
        private readonly roleRepository: RoleRepository,

        private readonly prisma: PrismaService,

    ){}

    public async createRoleWithPermissions(data: CreateRole){
        const {name, permissions} = data;
        const incomingPermissionIds = permissions.map(p => p.permissionId)
        try{
            return await this.prisma.$transaction(async (tx) => {
                const newRole = await this.roleRepository.txCreateOne(name, tx);
                // Получаем существующие permissions, чтобы отсеять невалидные id
                const DBpermissions = await this.permissionRepository.txFindManyByIds(incomingPermissionIds, tx);
                const mappedRolePermissions = PermissionsUtil.mapAndFilterPermissionsToRolePermissions(DBpermissions, newRole.id, permissions);
    
                let rolePermissionsToCreate = mappedRolePermissions;
    
                // Если количество валидных permissions не совпадает с переданными,
                // либо список permissions пустой, добавляем оставшиеся с дефолтным значением (false)
                if (mappedRolePermissions.length !== permissions.length 
                    || permissions.length === 0) {
                    const excludePermissions = await this.permissionRepository.txFindManyByIdsExclude(incomingPermissionIds, tx);
                    const mappedExcludePermissions = excludePermissions.map(ex_perm => ({
                        roleId: newRole.id,
                        permissionId: ex_perm.id,
                        allowed: false
                    }));
                    rolePermissionsToCreate = [...mappedRolePermissions, ...mappedExcludePermissions];
                }
    
                await this.rolePermissionRepository.txCreateMany(rolePermissionsToCreate, tx);
                const newRolePermissions = await this.rolePermissionRepository.txFindManyWithKeysByRoleId(newRole.id, tx);
                const { role } = plainToInstance(SingleRoleResponse, { role: newRole }, { excludeExtraneousValues: true });
    
                return {
                    role,
                    permissions: PermissionsUtil.mapPrismaPermissionsToPermissionTable(newRolePermissions)
                };
            });
        }catch(error:any){
            throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
        }
    }

    public async getRoles(){
        const roles = await this.roleRepository.findMany()
        return plainToInstance(RolesResponse, { roles }, { excludeExtraneousValues: true });
    }

    public async getRoleByPublicId(publicId: string){
        const singleRole = await this.roleRepository.findOneByPublicId(publicId);
        
        return plainToInstance(SingleRoleResponse, {role: singleRole},  {excludeExtraneousValues: true});
    }

    public async getRolesWithPermissions(){
        const RolesAndPermissions = await this.roleRepository.findManyWithRolePermissions();
        
        return RolesUtil.mapRolesWithRolePermissions(RolesAndPermissions);
    }

    public async getRoleByPublicIdWithPermissions(publicId: string){
        const singleRoleWithPermissions = await this.roleRepository.findOneByPublicIdWithPermissions(publicId);
        if(!singleRoleWithPermissions) throw new InternalServerErrorException(`${ERROR_MESSAGES.DATA_IS_NOT_EXISTS}`);
        
        const { role } = plainToInstance(SingleRoleResponse, { role: singleRoleWithPermissions }, { excludeExtraneousValues: true });
        
        return {
                role,
                permissions: PermissionsUtil.mapPrismaPermissionsToPermissionTable(singleRoleWithPermissions!.RolePermission)
            };
    }

    public async updateRoleByPublicId(publicId: string, data:UpdateRole ) {
        const role = await this.roleRepository.findOneByPublicId(publicId);
        
        if(!role) throw new InternalServerErrorException(`${ERROR_MESSAGES.DATA_IS_NOT_EXISTS}`);
        if(!role.isMutable || !role.isVisible) throw new InternalServerErrorException(`${ERROR_MESSAGES.DONT_HAVE_RIGHTS}`);
        
        const updatedRole = await this.roleRepository.updateOneByPublicId(data, publicId);
        return plainToInstance(SingleRoleResponse, {role: updatedRole},  {excludeExtraneousValues: true});
    }

    public async deleteRoleByPublicId(publicId: string, deep: boolean) {
        const role = await this.roleRepository.findOneByPublicId(publicId);
        if(!role) throw new InternalServerErrorException(`${ERROR_MESSAGES.DATA_IS_NOT_EXISTS}`);
        if(!role.isMutable || !role.isVisible) throw new InternalServerErrorException(`${ERROR_MESSAGES.DONT_HAVE_RIGHTS}`);
        
        await this.prisma.$transaction(async (tx) => {
            const tempRole: Role | null = await this.roleRepository.txfindOneByPublicId(getNoAccessAgentSeedRole().publicId, tx);
            if(!tempRole) throw new InternalServerErrorException(`${ERROR_MESSAGES.DATA_IS_NOT_EXISTS}`);
            const agents: Agent[] = await tx.agent.findMany({where: {roleId: role.id}});
            await tx.agent.updateMany({where: {roleId: role.id}, data: {roleId: tempRole.id}});

            await this.rolePermissionRepository.txDeleteManyByRoleId(role.id, tx);
            await this.roleRepository.txDeleteOneByPublicId(publicId, tx);

            if(deep){
                await this.deepDeleteRoleByPublicId(tx, agents, tempRole);
            }
        })
        
    }

    private async deepDeleteRoleByPublicId(tx: Prisma.TransactionClient, agents: Agent[], tempRole: Role){ 
        const agentIds = agents.map(a => a.id);
        await this.agentPermissionRepository.txDeleteManyByAgentsIds(agentIds, tx);  

        const rolePerms = await this.rolePermissionRepository.txFindManyByRoleId(tempRole.id, tx)
        
        const agentsPermissions: AllowedPermission[] = [];
        agentIds.forEach(agentId => {
                const agentPerms = PermissionsUtil.mapRolePermissionsToAgentPermissions(rolePerms, agentId);
                agentsPermissions.push(...agentPerms);
        })
        
        await this.agentPermissionRepository.txCreateMany(agentsPermissions, tx);

    }

    

}
