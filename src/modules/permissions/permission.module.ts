import { forwardRef, Module } from '@nestjs/common';
import {
  AgentPermissionsController,
  RolesPermissionsController,
} from '@/modules/permissions/controllers';
import {
  AgentPermissionsService,
  RolePermissionsService,
  ValidationService,
} from '@/modules/permissions/service';
import {
  AgentPermissionRepository,
  PermissionRepository,
  RolePermissionRepository,
} from '@/modules/permissions/repositories';
import { AgentModule } from '@/modules/agent/agent.module';
import { AgentRepository } from '@/modules/agent/repositories';
import { ValidationModule } from '@/shared/services/validation';
import { AuthRedisModule, AuthRedisService } from '@/shared/services/redis/auth-redis';
import { RoleModule } from '@/modules/role/role.module';

@Module({
  imports: [forwardRef(() => AgentModule), ValidationModule, AuthRedisModule, RoleModule],
  controllers: [AgentPermissionsController, RolesPermissionsController],
  providers: [
    AgentPermissionsService,
    RolePermissionsService,
    AuthRedisService,
    ValidationService,
    AgentRepository,
    PermissionRepository,
    AgentPermissionRepository,
    RolePermissionRepository,

  ],
  exports: [
    RolePermissionRepository,
    AgentPermissionRepository,
    AgentPermissionsService,
    PermissionRepository,
  ],
})
export class PermissionModule {}
