import { Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { RoleService } from '../services/role.service';
import { ENDPOINTS } from '@/shared/constants/endpoints';
import { UUIDValidationPipe } from '@/common/pipes';

@Controller(ENDPOINTS.ROLE.BASE)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get(ENDPOINTS.ROLE.GET_ALL_ROLES)
  async getRoles() {}

  @Get(ENDPOINTS.ROLE.GET_ONE)
  async getRole(
    @Param('publicId', UUIDValidationPipe) publicId: string,
  ) {
    return this.roleService.getRoleByPublicId(publicId);
  }

  @Post(ENDPOINTS.ROLE.CREATE_ROLE)
  async createRole() {}

  @Patch(ENDPOINTS.ROLE.UPDATE_ONE_ROLE)
  async updateRole(
    @Param('publicId', UUIDValidationPipe) publicId: string,
  ) {

  }

  @Delete(ENDPOINTS.ROLE.DELETE_ROLE)
  async deleteRole(
    @Param('publicId', UUIDValidationPipe) publicId: string,
  ) {}
}
