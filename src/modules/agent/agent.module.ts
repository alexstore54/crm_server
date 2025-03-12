import { forwardRef, Module } from '@nestjs/common';
import { AgentService } from '@/modules/agent/services/agent.service';
import { AgentsController } from '@/modules/agent/controllers/agents.controller';
import { AgentRepository } from '@/modules/agent/repositories/agent.repository';
import { AgentAccessGuard } from '@/common/guards/tokens/agent';
import { UserModule } from '@/modules/user/user.module';
import { PermissionModule } from '@/modules/permissions/permission.module';
import { DeskRepository } from '@/modules/agent/repositories';
import { AuthRedisModule, AuthRedisService } from '@/shared/services/redis/auth-redis';
import { ValidationModule, ValidationService } from '@/shared/services/validation';
import { AgentController } from '@/modules/agent/controllers/agent.controller';
import { TeamModule } from '@/modules/team/team.module';
import { TeamRepository } from '@/modules/team/repositories/team.repository';
import { AgentPermissionsService } from '@/modules/permissions/service';

@Module({
  imports: [
    UserModule,
    forwardRef(() => PermissionModule),
    AuthRedisModule,
    ValidationModule,
    TeamModule,
  ],
  controllers: [AgentsController, AgentController],
  providers: [
    //guards
    AgentAccessGuard,
    //services
    AuthRedisService,
    AgentService,
    ValidationService,
    AgentPermissionsService,
    //repositories
    AgentRepository,
    TeamRepository,
    DeskRepository,
  ],
  exports: [AgentRepository],
})
export class AgentModule {}
