import { Module } from '@nestjs/common';
import {
  AgentPermissionsController,
  RolePermissionsController,
} from '@/modules/permissions/controllers';
import { AgentPermissionsService, RolePermissionsService } from '@/modules/permissions/service';
import {
  AgentPermissionRepository,
  RolePermissionRepository,
} from '@/modules/permissions/repositories';

@Module({
  controllers: [AgentPermissionsController, RolePermissionsController],
  providers: [
    AgentPermissionsService,
    RolePermissionsService,
    AgentPermissionRepository,
    RolePermissionRepository,
  ],
  exports: [RolePermissionRepository, AgentPermissionRepository],
})
export class PermissionModule {}
