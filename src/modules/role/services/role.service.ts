import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { RoleRepository } from "../repositories/role.repository";
import { Role, RolePermission } from "@prisma/client";
import { CreateRole } from "../dto/createRole.dto";
import { RolePermissionRepository } from "@/modules/agent/repositories";
import { PermissionRepository } from "@/modules/permissions/repositories";
import { ERROR_MESSAGES } from "@/shared/constants/errors";
import { PermissionsUtil } from "@/shared/utils";
import { PrismaService } from "@/shared/db/prisma";
import { plainToInstance } from "class-transformer";
import { RoleAndPermissionsResponse, RolesResponse } from "../dto/responseRole.dto";
import { RolesUtil } from "@/shared/utils/roles/roles.util";

@Injectable()
export class RoleService {
    constructor(
        private readonly rolePermissionRepository: RolePermissionRepository,
        private readonly roleRepository: RoleRepository,
        private readonly permissionRepository: PermissionRepository,
        private readonly prisma: PrismaService

    ){}

    public async createRoleWithPermissions(data: CreateRole):Promise<{role: Role, permissions: RolePermission[]}>{
        const {name, permissions} = data;
        const incomingPermissionIds = permissions.map(p => p.permissionId)
        try{
            return await this.prisma.$transaction(async (tx) => {
                const newRole = await this.roleRepository.txCreateOne(name, tx);
                // Вытаскиваем реально существующие permissions, тем самым отсеивая невалидные id с клиента 
                const DBpermissions = await this.permissionRepository.txFindManyByIds(incomingPermissionIds, tx);
                // Фильтруем и собираем данные 
                const mappedRolePermissions = PermissionsUtil.mapAndFilterPermissionsToRolePermissions(DBpermissions, newRole.id, permissions);
                
                // В случае, если всё таки какие-то permissionID были невалидными, либо permissions пришли пустыми,
                // то ищем остатки которые остались и задаём им false вручную
                if(mappedRolePermissions.length !== permissions.length 
                || permissions.length === 0){

                    const ExcludePermissions = await this.permissionRepository.txFindManyByIdsExclude(incomingPermissionIds, tx);
                    const mapExcludePermissions = ExcludePermissions.map(ex_perm => (
                        {
                            roleId: newRole.id,
                            permissionId: ex_perm.id,
                        }
                    ))
                    const newRolePermissions = await this.rolePermissionRepository.txCreateMany([...mapExcludePermissions, ...mappedRolePermissions], tx);
                    
                    return {
                            role: newRole,
                            permissions: newRolePermissions
                        }
                }else {
                    const newRolePermissions = await this.rolePermissionRepository.txCreateMany(mappedRolePermissions, tx);
                    return {
                            role: newRole,
                            permissions: newRolePermissions
                        }
                }
                
            })
        }catch(error:any){
            throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
        }
    }

    public async getRoles(){
        const roles = await this.roleRepository.findMany()
        return plainToInstance(RolesResponse, { roles }, { excludeExtraneousValues: true });
    }

    public async getRoleByPublicId(publicId: string): Promise<Role | null>{
        return this.roleRepository.findOneByPublicId(publicId)
    }

    public async getRolesWithPermissions(){
        const RolesAndPermissions = await this.roleRepository.findManyWithRolePermissions();
        const formattedRoles = RolesUtil.mapRolesWithRolePermissions(RolesAndPermissions);
        return plainToInstance(RoleAndPermissionsResponse, formattedRoles, { excludeExtraneousValues: true }); 
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
