import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { RoleRepository } from "../repositories/role.repository";
import { Permission, Role, RolePermission } from "@prisma/client";
import { CreateRole } from "../dto/createRole.dto";
import { RolePermissionRepository } from "@/modules/agent/repositories";
import { PermissionRepository } from "@/modules/permissions/repositories";
import { ERROR_MESSAGES } from "@/shared/constants/errors";
import { PermissionsUtil } from "@/shared/utils";
import { PrismaService } from "@/shared/db/prisma";
import { plainToInstance } from "class-transformer";
import { RoleAndPermissionsResponse, RolesResponse, SingleRoleResponse } from "../dto/responseRole.dto";
import { RolesUtil } from "@/shared/utils/roles/roles.util";

@Injectable()
export class RoleService {
    constructor(
        private readonly rolePermissionRepository: RolePermissionRepository,
        private readonly roleRepository: RoleRepository,
        private readonly permissionRepository: PermissionRepository,
        private readonly prisma: PrismaService

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
                if (mappedRolePermissions.length !== permissions.length || permissions.length === 0) {
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
        
    }

    public async updateRole() {}

    public async deleteRole() {}

    public async readRoleWithPermissionsByPublicId(publicId: string) {
        try {
        } catch (err: any) {}
    }
}
