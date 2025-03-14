import { Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { RoleService } from '../services/role.service';
import { ENDPOINTS } from '@/shared/constants/endpoints';

@Controller(ENDPOINTS.ROLE.BASE)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get(ENDPOINTS.ROLE.GET_ONE)
  async getRole() {}

  @Post(ENDPOINTS.ROLE.CREATE_ROLE)
  async createRole() {}

  @Patch(ENDPOINTS.ROLE.UPDATE_ONE_ROLE)
  async updateRole() {}

  @Delete(ENDPOINTS.ROLE.DELETE_ROLE)
  async deleteRole() {}
}
