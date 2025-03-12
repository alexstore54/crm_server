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
import { RoleModule } from '@/modules/role/role.module';
import { RoleRepository } from '@/modules/role/repositories/role.repository';

@Module({
  imports: [forwardRef(() => AgentModule), ValidationModule, AuthRedisModule, RoleModule],
  controllers: [AgentPermissionsController, RolePermissionsController],
  providers: [
    AgentPermissionsService,
    RolePermissionsService,
    AuthRedisService,
    ValidationService,

    AgentRepository,
    AgentPermissionRepository,
    RolePermissionRepository,
    RoleRepository,
  ],
  exports: [RolePermissionRepository, AgentPermissionRepository, AgentPermissionsService],
})
export class PermissionModule {}
