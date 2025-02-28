import { forwardRef, Module } from '@nestjs/common';
import { AgentService } from '@/modules/agent/services/agent.service';
import { AgentsController } from '@/modules/agent/controllers/agents.controller';
import { AgentRepository } from '@/modules/agent/repositories/agent.repository';
import { AgentAccessGuard } from '@/common/guards/tokens/agent';
import { UserModule } from '@/modules/user/user.module';
import { PermissionModule } from '@/modules/permissions/permission.module';
import {
  AgentPermissionRepository,
  RolePermissionRepository,
} from '@/modules/permissions/repositories';
import { DeskRepository } from '@/modules/agent/repositories';

@Module({
  imports: [UserModule, forwardRef(() => PermissionModule)],
  providers: [
    AgentService,
    AgentRepository,
    AgentAccessGuard,
    AgentPermissionRepository,
    RolePermissionRepository,
    DeskRepository,
  ],
  controllers: [AgentsController],
  exports: [AgentRepository],
})
export class AgentModule {}
