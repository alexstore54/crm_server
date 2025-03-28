import { forwardRef, Module } from '@nestjs/common';
import { AgentService } from '@/modules/agent/services/agent.service';
import { AgentsController } from '@/modules/agent/controllers/agents.controller';
import { AgentRepository } from '@/modules/agent/repositories/agent.repository';
import { AgentAccessGuard } from '@/common/guards/tokens/agent';
import { LeadModule } from '@/modules/lead/lead.module';
import { PermissionModule } from '@/modules/permissions/permission.module';
import { AuthRedisModule, AuthRedisService } from '@/shared/services/redis/auth-redis';
import { ValidationModule, ValidationService } from '@/shared/services/validation';
import { AgentController } from '@/modules/agent/controllers/agent.controller';
import { TeamModule } from '@/modules/team/team.module';
import { TeamRepository } from '@/modules/team/repositories/team.repository';
import { AgentPermissionsService } from '@/modules/permissions/service';
import { DeskRepository } from '@/modules/desk/repositories';
import { MediaModule } from '@/modules/media';

@Module({
  imports: [
    LeadModule,
    forwardRef(() => PermissionModule),
    AuthRedisModule,
    ValidationModule,
    TeamModule,
    MediaModule,
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
