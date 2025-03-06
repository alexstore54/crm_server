import { forwardRef, Module } from '@nestjs/common';
import {
  AgentPermissionsController,
  RolePermissionsController,
} from '@/modules/permissions/controllers';
import {
  AgentPermissionsService,
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
    AgentRepository,
    AgentPermissionsService,
    RolePermissionsService,
    AgentPermissionRepository,
    RolePermissionRepository,
    AuthRedisService,
    ValidationService,
  ],
  exports: [RolePermissionRepository, AgentPermissionRepository],
})
export class PermissionModule {}
