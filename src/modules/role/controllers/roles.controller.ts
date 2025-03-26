import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseBoolPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { RoleService } from '../services/role.service';
import { ENDPOINTS, RESPONSE_STATUS } from '@/shared/constants/endpoints';
import { UUIDValidationPipe } from '@/common/pipes';
import { CreateRole, UpdateRole } from '@/modules/role/dto';
import { UsePermissions } from '@/common/decorators/validation';
import { ENDPOINTS_PERMISSIONS } from '@/shared/constants/permissions';
import { AgentAccessGuard } from '@/common/guards/tokens/agent';
import { PermissionsGuard } from '@/common/guards/permissions';
import { UploadPicture } from '@/common/decorators/media';
import { UpdateMediaParams } from '@/shared/types/media';
import { RoleForClient, FullRole } from '@/shared/types/roles';

//#REFACTORED - добавил гуарды, убрал лишние эндпоинты
//ENDPOINTS.ROLE -> ENDPOINTS.ROLES (доеб, но так правильнее)
//добавил возвращаемые типы

@Controller(ENDPOINTS.ROLES.BASE)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @UsePermissions(ENDPOINTS_PERMISSIONS.ROLES.GET_ONE)
  @UseGuards(AgentAccessGuard, PermissionsGuard)
  @Get(ENDPOINTS.ROLES.GET_ONE)
  async getRoleWithPermissions(
    @Param('publicId', UUIDValidationPipe) publicId: string,
  ): Promise<FullRole> {
    return this.roleService.getFullRole(publicId);
  }

  //#REFACTORED - добавил пагинацию query, limit
  @UsePermissions(ENDPOINTS_PERMISSIONS.ROLES.GET_MANY)
  @UseGuards(AgentAccessGuard, PermissionsGuard)
  @Get(ENDPOINTS.ROLES.GET_MANY)
  async getRoles(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<RoleForClient[]> {
    return this.roleService.getRoles(page, limit);
  }

  @UploadPicture()
  @UsePermissions(ENDPOINTS_PERMISSIONS.ROLES.CREATE_ONE)
  @UseGuards(AgentAccessGuard, PermissionsGuard)
  @Post(ENDPOINTS.ROLES.CREATE_ONE)
  async createRoleWithPermissions(
    @Body() body: CreateRole,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<FullRole> {
    return this.roleService.createOne(body, file);
  }

  @UploadPicture()
  @UsePermissions(ENDPOINTS_PERMISSIONS.ROLES.UPDATE_ONE)
  @UseGuards(AgentAccessGuard, PermissionsGuard)
  @Patch(ENDPOINTS.ROLES.UPDATE_ONE_ROLE)
  async updateRole(
    @Param('publicId', UUIDValidationPipe) publicId: string,
    @Body() data: UpdateRole,
    @Query('isAvatarRemoved', ParseBoolPipe) isAvatarRemoved?: boolean,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<FullRole> {
    const updateMediaParams: UpdateMediaParams = {
      isAvatarRemoved,
      file,
    };
    return this.roleService.updateRoleByPublicId(publicId, data, updateMediaParams);
  }

  @UsePermissions(ENDPOINTS_PERMISSIONS.ROLES.DELETE_ONE)
  @UseGuards(AgentAccessGuard, PermissionsGuard)
  @Delete(ENDPOINTS.ROLES.DELETE_ONE)
  async deleteRole(
    @Param('publicId', UUIDValidationPipe) publicId: string,
    @Query('deep') deep: boolean,
  ): Promise<string> {
    await this.roleService.deleteRoleByPublicId(publicId, deep);
    return RESPONSE_STATUS.SUCCESS;
  }
}
