import { forwardRef, Module } from '@nestjs/common';
import {
  AgentPermissionsController,
  RolePermissionsController,
} from '@/modules/permissions/controllers';
import {
  AgentPermissionsService,
  PermissionsService,
  RolePermissionsService,
  ValidationService,
} from '@/modules/permissions/service';
import {
  AgentPermissionRepository,
  RolePermissionRepository,
} from '@/modules/permissions/repositories';
import { AgentModule } from '@/modules/agent/agent.module';
import { AgentRepository } from '@/modules/agent/repositories';
import { ValidationModule } from '@/shared/services/validation';
import { AuthRedisModule, AuthRedisService } from '@/shared/services/redis/auth-redis';

@Module({
  imports: [forwardRef(() => AgentModule), ValidationModule, AuthRedisModule],
  controllers: [AgentPermissionsController, RolePermissionsController],
  providers: [
    AgentPermissionsService,
    RolePermissionsService,
    AuthRedisService,
    ValidationService,
    PermissionsService,

    AgentRepository,
    AgentPermissionRepository,
    RolePermissionRepository,
  ],
  exports: [
    RolePermissionRepository,
    AgentPermissionRepository,
    PermissionsService,
    AgentPermissionsService,
  ],
})
export class PermissionModule {}
