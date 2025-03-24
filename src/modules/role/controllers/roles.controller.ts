import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { RoleService } from '../services/role.service';
import { ENDPOINTS } from '@/shared/constants/endpoints';
import { UUIDValidationPipe } from '@/common/pipes';
import { CreateRole, UpdateRole } from '../dto/createRole.dto';

@Controller(ENDPOINTS.ROLE.BASE)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}
  
  // Получение всех ролей с правами
  @Get(ENDPOINTS.ROLE.GET_ALL_WITH_PERMISSSIONS)
  async getRolesWithPermissions() {
    return this.roleService.getRolesWithPermissions();
  }

  // Получение конкретной роли с правами
  @Get(ENDPOINTS.ROLE.GET_ONE_WITH_PERMISSSIONS)
  async getRoleWithPermissions(
    @Param('publicId', UUIDValidationPipe) publicId: string,
  ) {
    return this.roleService.getRoleByPublicIdWithPermissions(publicId);
  }

  // Получение всех ролей
  @Get(ENDPOINTS.ROLE.GET_ALL)
  async getRoles() {
    return this.roleService.getRoles();
  }

  // Получение конкретной роли
  @Get(ENDPOINTS.ROLE.GET_ONE)
  async getRole(
    @Param('publicId', UUIDValidationPipe) publicId: string,
  ) {
    return this.roleService.getRoleByPublicId(publicId);
  }


  @Post(ENDPOINTS.ROLE.CREATE_ROLE)
  async createRoleWithPermissions(
      @Body() body: CreateRole
  ) {
    return this.roleService.createRoleWithPermissions(body)
  }

  @Patch(ENDPOINTS.ROLE.UPDATE_ONE_ROLE)
  async updateRole(
    @Param('publicId', UUIDValidationPipe) publicId: string,
    @Body() data: UpdateRole
  ) {
      return this.roleService.updateRoleByPublicId(publicId, data)
  }

  @Delete(ENDPOINTS.ROLE.DELETE_ROLE)
  async deleteRole(
    @Param('publicId', UUIDValidationPipe) publicId: string,
    @Query('deep') deep: boolean
  ) {
      console.log(deep)
      return this.roleService.deleteRoleByPublicId(publicId, deep);   
    }
}
