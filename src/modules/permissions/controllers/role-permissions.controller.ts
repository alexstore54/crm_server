import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { UsePermissions } from '@/common/decorators/validation';
import { ENDPOINTS_PERMISSIONS } from '@/shared/constants/permissions';
import { AgentAccessGuard } from '@/common/guards/tokens/agent';
import { AgentPermissionGuard, PermissionsGuard } from '@/common/guards/permissions';
import { RolePermissionsService } from '@/modules/permissions/service';
import { UUIDValidationPipe } from '@/common/pipes';

@Controller('permissions/role')
export class RolePermissionsController {
  constructor(private readonly rolePermissionsService: RolePermissionsService) {}

  @UsePermissions(ENDPOINTS_PERMISSIONS.ROLE_PERMISSIONS.UPDATE_ROLES_PERMISSIONS)
  @UseGuards(AgentAccessGuard, PermissionsGuard, AgentPermissionGuard)
  @Patch(':publicId/update')
  async updateRolePermissions(
    @Param('publicId', UUIDValidationPipe) publicId: string,
    @Body() body: any,
  ) {
    // return this.rolePermissionsService.updateOneByRolePublicId(publicId, body);
  }
}
