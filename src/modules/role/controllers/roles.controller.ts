import { Controller, Delete, Get, Patch, Post } from "@nestjs/common";
import { RoleService } from "../services/role.service";




@Controller('role')
export class RoleController {
    constructor(private readonly roleService: RoleService) {}

    @Get(':publicId')
    async getRole(){

    }

    @Post('/')
    async createRole(){

    }

    @Patch(':publicId')
    async updateRole(){
        
    }

    @Delete(':publicId')
    async deleteRole(){
        
    }

}