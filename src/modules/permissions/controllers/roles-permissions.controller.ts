import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { UsePermissions } from '@/common/decorators/validation';
import { ENDPOINTS_PERMISSIONS } from '@/shared/constants/permissions';
import { AgentAccessGuard } from '@/common/guards/tokens/agent';
import { AgentPermissionGuard, PermissionsGuard } from '@/common/guards/permissions';
import { RolePermissionsService } from '@/modules/permissions/service';
import { UUIDValidationPipe } from '@/common/pipes';
import { ENDPOINTS } from '@/shared/constants/endpoints';

@Controller(ENDPOINTS.ROLES_PERMISSIONS.BASE)
export class RolesPermissionsController {
  constructor(private readonly rolePermissionsService: RolePermissionsService) {}

  @UsePermissions(ENDPOINTS_PERMISSIONS.ROLE_PERMISSIONS.UPDATE_ROLES_PERMISSIONS)
  @UseGuards(AgentAccessGuard, PermissionsGuard, AgentPermissionGuard)
  @Patch(ENDPOINTS.ROLES_PERMISSIONS.UPDATE_ROLE_PERMISSIONS)
  async updateRolePermissions(
    @Param('publicId', UUIDValidationPipe) publicId: string,
    @Body() body: any,
  ) {
    return this.rolePermissionsService.updateRolePermissions(publicId, body);
  }

  @UsePermissions(ENDPOINTS_PERMISSIONS.ROLE_PERMISSIONS.UPDATE_ROLES_PERMISSIONS)
  @UseGuards(AgentAccessGuard, PermissionsGuard, AgentPermissionGuard)
  @Patch(ENDPOINTS.ROLES_PERMISSIONS.UPDATE_DEEP_ROLE_PERMISSIONS)
  async updateDeepRolePermissions(
    @Param('publicId', UUIDValidationPipe) publicId: string,
    @Body() body: any,
  ) {
    return this.rolePermissionsService.deepUpdateRolePermissions(publicId, body);
  }
}
