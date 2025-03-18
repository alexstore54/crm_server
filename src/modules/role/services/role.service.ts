import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { RoleRepository } from "../repositories/role.repository";
import { PrismaClient, Role } from "@prisma/client";
import { CreateRole } from "../dto/createRole.dto";
import { RolePermissionRepository } from "@/modules/agent/repositories";
import { PermissionRepository } from "@/modules/permissions/repositories";
import { ERROR_MESSAGES } from "@/shared/constants/errors";

@Injectable()
export class RoleService {
    constructor(
        private readonly rolePermissionRepository: RolePermissionRepository,
        private readonly roleRepository: RoleRepository,
        private readonly permissionRepository: PermissionRepository,
        private readonly prisma: PrismaClient
    ){}

    public async createRole(data: CreateRole){
        const {name, permissions} = data;
        const incomingPermissionIds = permissions.map(p => p.permissionId)
        try{
            return await this.prisma.$transaction(async (tx) => {
                const newRole = await this.roleRepository.txCreateOne(name, tx);
                // Вытаскиваем реально существующие permissions, тем самым отсеивая невалидные id с клиента 
                const DBpermissions = await this.permissionRepository.txFindManyByIds(incomingPermissionIds, tx);
                // Фильтруем и собираем данные 
                const mapPermissionsToRolePermissions = DBpermissions.map(db_perm => {
                    const incomePermisson = permissions.find(in_perm => in_perm.permissionId === db_perm.id);
                    if(incomePermisson){
                        return {
                            roleId: newRole.id,
                            permissionId: incomePermisson.permissionId,
                            allowed: incomePermisson.allowed
                        }
                    }
                    return null;
                }).filter(item => item !== null);
                
                // В случае, если всё таки какие-то permissionID были невалидными, 
                // то ищем остатки которые остались и задаём им false вручную
                if(mapPermissionsToRolePermissions.length !== permissions.length){
                    const ExcludePermissions = await this.permissionRepository.txFindManyByIdsExclude(incomingPermissionIds, tx);
                    const mapExcludePermissions = ExcludePermissions.map(ex_perm => (
                        {
                            roleId: newRole.id,
                            permissionId: ex_perm.id,
                        }
                    ))
                    const newRolePermissions = await this.rolePermissionRepository.txCreateMany([...mapExcludePermissions, ...mapPermissionsToRolePermissions],tx);
                    return {
                            role: newRole,
                            permissions: newRolePermissions
                    }
                }else {
                    const newRolePermissions = await this.rolePermissionRepository.txCreateMany(mapPermissionsToRolePermissions, tx);
                    return {
                            role: newRole,
                            permissions: newRolePermissions
                    }
                }
                
                // const newRolePermissions = await this.rolePermissionRepository.
            })
        }catch(error:any){
            throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
        }
    }

    public async getRoles():Promise<Role[]>{
        return this.roleRepository.findMany()
    }

    public async getRoleByPublicId(publicId: string): Promise<Role | null>{
        return this.roleRepository.findOneByPublicId(publicId)
    }

    public async updateRole() {}

    public async deleteRole() {}

    public async readRoleWithPermissionsByPublicId(publicId: string) {
        try {
        } catch (err: any) {}
    }
}
