import { Body, Controller, Delete, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { RoleService } from '../services/role.service';
import { ENDPOINTS } from '@/shared/constants/endpoints';
import { UUIDValidationPipe } from '@/common/pipes';
import { CreateRole } from '../dto/createRole.dto';

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
  async createRole(
     @Req() req: Request, @Body() body: CreateRole
  ) {
    return this.roleService.createRole(body)
  }

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
