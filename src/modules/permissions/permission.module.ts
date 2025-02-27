import { forwardRef, Module } from '@nestjs/common';
import {
  AgentPermissionsController,
  RolePermissionsController,
} from '@/modules/permissions/controllers';
import { AgentPermissionsService, RolePermissionsService } from '@/modules/permissions/service';
import {
  AgentPermissionRepository,
  RolePermissionRepository,
} from '@/modules/permissions/repositories';
import { AgentModule } from '@/modules/agent/agent.module';
import { AgentRepository } from '@/modules/agent/repositories';

@Module({
  imports: [forwardRef(() => AgentModule)],
  controllers: [AgentPermissionsController, RolePermissionsController],
  providers: [
    AgentRepository,
    AgentPermissionsService,
    RolePermissionsService,
    AgentPermissionRepository,
    RolePermissionRepository,
  ],
  exports: [RolePermissionRepository, AgentPermissionRepository],
})
export class PermissionModule {}
