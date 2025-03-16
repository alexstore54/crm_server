import { Injectable } from "@nestjs/common";
import { RoleRepository } from "../repositories/role.repository";
import { Role } from "@prisma/client";


@Injectable()
export class RoleService {
    constructor(private readonly roleRepository: RoleRepository){}

    public async createRole(){

    }

    public async getRoles():Promise<Role[]>{
        return this.roleRepository.findMany()
    }

    public async getRoleByPublicId(publicId: string): Promise<Role | null>{
        return this.roleRepository.findOneByPublicId(publicId)
    }

    public async updateRole(){
        
    }

    public async deleteRole(){
        
    }

    public async readRoleWithPermissionsByPublicId(publicId: string){
        try{

        }catch(err: any){
            
        }
    }

}