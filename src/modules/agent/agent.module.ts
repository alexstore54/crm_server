import { Module } from '@nestjs/common';
import { AgentService } from '@/modules/agent/services/agent.service';
import { AgentController } from '@/modules/agent/controllers/agent.controller';
import { AgentRepository } from '@/modules/agent/repositories/agent.repository';
import { AgentAccessGuard, ModeratorGuard } from '@/common/guards/tokens/agent';
import { UserModule } from '@/modules/user/user.module';
import { PermissionModule } from '@/modules/permissions/permission.module';
import {
  AgentPermissionRepository,
  RolePermissionRepository,
} from '@/modules/permissions/repositories';

@Module({
  imports: [UserModule, PermissionModule],
  providers: [
    AgentService,
    AgentRepository,
    AgentAccessGuard,
    ModeratorGuard,
    AgentPermissionRepository,
    RolePermissionRepository,
  ],
  controllers: [AgentController],
  exports: [AgentRepository],
})
export class AgentModule {}
